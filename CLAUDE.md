# CLAUDE.md — エージェント向けコンテキストファイル

このファイルは Claude Code および AI エージェントが本リポジトリを理解するための「真実の源（Single Source of Truth）」です。

## プロジェクト概要

**profile-chat-ai-docs** は、AIポートフォリオアプリ「profile-chat-ai」の設計図およびドキュメントを管理するリポジトリです。アプリ本体のコードは含まず、**設計ドキュメント・仕様書・インフラ定義** のみを管理します。

## システム構成サマリ

```
ユーザー
  │
  ▼
Next.js (App Router)  ← フロントエンド + BFF
  │  Tailwind CSS + DaisyUI
  │  Route Handlers (SSE中継)
  │
  ▼ HTTP SSE
FastAPI (Python)      ← AIバックエンド
  │  LangGraph エージェント
  │
  ├── Amazon Bedrock (Claude Haiku 3.5)
  ├── Amazon DynamoDB (チェックポインター)
  └── Amazon S3 Vectors (RAGベクトルストア)
```

詳細は [`docs/architecture/overall.md`](docs/architecture/overall.md) を参照。

## 技術スタック

| レイヤー | 技術 | 備考 |
|---------|------|------|
| フロントエンド | Next.js 14+ (App Router / TypeScript) | `src/app/` 構成 |
| UI / CSS | Tailwind CSS + DaisyUI | `chat-bubble` 等の意味論的クラス |
| BFF | Next.js Route Handlers | Python API への SSE 中継 |
| AIバックエンド | FastAPI + LangGraph (Python) | Lambda Web Adapter でサーバーレス化 |
| AI モデル | Amazon Bedrock — Claude Haiku 3.5 | コスト最適化のため Haiku を採用 |
| 永続化 | DynamoDB + S3 (状態オフロード) | `langgraph-checkpoint-aws` 使用 |
| RAG | Amazon S3 Vectors + Bedrock Knowledge Bases | 月額数円〜の低コスト構成 |
| インフラ定義 | AWS CDK (TypeScript) | `infra/cdk/` 参照 |

## ツールチェーン規約

- **Python**: `uv` で管理（`pyproject.toml` + `uv.lock`）
- **Node.js**: `fnm` で管理（`.node-version` または `.nvmrc`）
- **パッケージマネージャ**: Python は `uv`, Node は `pnpm` 推奨

## ドキュメント構造

```
docs/
├── architecture/
│   ├── overall.md          # システム全体構成
│   └── rag-pipeline.md     # 低コスト RAG 設計
├── frontend/
│   └── ui-design.md        # DaisyUI チャット UI 設計指針
├── api/
│   └── streaming-spec.md   # SSE ストリーミング仕様
├── infrastructure/
│   ├── aws-resources.md    # AWS リソース設計
│   └── cdk-guide.md        # CDK 戦略
└── development/
    └── local-setup.md      # ローカル開発環境構築
infra/
└── cdk/                    # CDK プロジェクト (TypeScript)
```

## 重要な設計方針

1. **コスト優先**: Bedrock Haiku 3.5 + S3 Vectors で月額数円〜を実現
2. **サーバーレス**: Lambda Web Adapter (LWA) で FastAPI をコンテナレスで運用
3. **状態管理**: DynamoDB で LangGraph の会話状態を永続化、350KB 超は S3 にオフロード
4. **UI の開発効率**: DaisyUI の意味論的クラスで Tailwind 単体より高速に実装

## Bedrock 固有の注意事項

```bash
# スロットリング対策: 出力トークン数を制限
export CLAUDE_CODE_MAX_OUTPUT_TOKENS=4096
```

詳細は [`docs/infrastructure/aws-resources.md`](docs/infrastructure/aws-resources.md) を参照。
