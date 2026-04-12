# 低コスト RAG パイプライン設計

## 概要

Amazon S3 Vectors と Bedrock Knowledge Bases を組み合わせ、**月額数円〜** で動作するRAG（Retrieval-Augmented Generation）パイプラインを構築します。従来の Pinecone や OpenSearch のような専用ベクトルDBは月額数十〜数百ドルかかりますが、S3 Vectors はリクエスト課金のため低トラフィックでは極めて安価に運用できます。

## コスト比較

| ソリューション | 月額コスト（概算） | 特徴 |
|-------------|----------------|------|
| Pinecone (Starter) | $70〜 | フルマネージド、高機能 |
| OpenSearch Serverless | $20〜 | AWS ネイティブ |
| **Amazon S3 Vectors** | **数円〜** | リクエスト課金、低トラフィック最適 |

## アーキテクチャ

```
ドキュメント投入フロー:
┌────────────┐    ┌──────────────────┐    ┌──────────────┐
│ ドキュメント │───▶│ Bedrock Embeddings│───▶│ S3 Vectors   │
│ (PDF等)    │    │ Titan Embed v2   │    │ Bucket       │
└────────────┘    └──────────────────┘    └──────────────┘

クエリフロー:
┌────────────┐    ┌──────────────────┐    ┌──────────────┐    ┌───────────┐
│ ユーザー   │───▶│ Bedrock Embeddings│───▶│ S3 Vectors   │───▶│ LangGraph │
│ クエリ     │    │ クエリベクトル化  │    │ 類似度検索    │    │ Context   │
└────────────┘    └──────────────────┘    └──────────────┘    └───────────┘
```

## S3 Vectors の構造

S3 Vectors は通常の S3 バケットと同じエンドポイントで動作し、専用の Vector Index を持ちます。

```
s3://profile-chat-ai-vectors/
└── index: profile-knowledge-base
    ├── metadata: { source, chunk_id, timestamp }
    └── vectors: float32[1536]  # Titan Embed v2 の次元数
```

### ベクトルの登録 (Python)

```python
import boto3

s3_vectors = boto3.client("s3vectors", region_name="us-east-1")

# ドキュメントのチャンクをベクトル化して登録
response = s3_vectors.put_vectors(
    VectorBucketName="profile-chat-ai-vectors",
    IndexName="profile-knowledge-base",
    Vectors=[
        {
            "Key": f"doc_{chunk_id}",
            "Data": {"Float32": embedding_vector},
            "Metadata": {
                "source": "portfolio.pdf",
                "chunk_id": chunk_id,
                "text": chunk_text,
            },
        }
    ],
)
```

### ベクトル検索 (Python)

```python
# クエリをベクトル化して類似検索
query_embedding = get_embedding(user_query)

results = s3_vectors.query_vectors(
    VectorBucketName="profile-chat-ai-vectors",
    IndexName="profile-knowledge-base",
    QueryVector={"Float32": query_embedding},
    TopK=5,
    ReturnMetadata=True,
)

# コンテキストとして LLM に渡す
contexts = [r["Metadata"]["text"] for r in results["Vectors"]]
```

## Bedrock Knowledge Bases との統合

Bedrock Knowledge Bases を使うと、ドキュメントの取り込み（チャンキング・埋め込み・インデックス化）を AWS がフルマネージドで行います。

```python
# Bedrock Knowledge Base から検索（エージェントツールとして使用）
bedrock_agent_runtime = boto3.client("bedrock-agent-runtime")

response = bedrock_agent_runtime.retrieve(
    knowledgeBaseId="XXXXXXXXXX",
    retrievalQuery={"text": user_query},
    retrievalConfiguration={
        "vectorSearchConfiguration": {"numberOfResults": 5}
    },
)

retrieved_results = response["retrievalResults"]
```

## LangGraph への統合

RAG 検索は LangGraph の **ツール** として定義し、エージェントが必要に応じて呼び出します。

```python
from langchain_core.tools import tool

@tool
def search_knowledge_base(query: str) -> str:
    """ポートフォリオの知識ベースを検索します。"""
    results = query_s3_vectors(query, top_k=5)
    return "\n---\n".join([r["text"] for r in results])

# LangGraph エージェントにツールを登録
tools = [search_knowledge_base]
agent = create_react_agent(llm, tools, checkpointer=dynamodb_checkpointer)
```

## チャンキング戦略

| 戦略 | チャンクサイズ | オーバーラップ | 用途 |
|-----|-------------|-------------|------|
| Fixed-size | 512 tokens | 50 tokens | 一般的なドキュメント |
| Semantic | 可変 | — | 意味単位で分割 |
| Hierarchical | 親512 / 子128 | — | 精度重視 |

本プロジェクトでは Bedrock Knowledge Bases のデフォルト（Fixed-size 300 tokens / overlap 20%）を採用。

## コスト最適化のポイント

1. **埋め込みモデル**: Titan Embed v2（低コスト）を使用
2. **キャッシュ**: 同一クエリの埋め込みは DynamoDB にキャッシュ
3. **Top-K の制限**: 検索結果は最大 5 件に絞り、コンテキスト長を節約
4. **バッチ投入**: ドキュメント更新は差分のみ再インデックス

## 関連ドキュメント

- [システム全体構成](overall.md)
- [AWS リソース設計](../infrastructure/aws-resources.md)
