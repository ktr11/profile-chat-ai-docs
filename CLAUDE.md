# CLAUDE.md — エージェント向けコンテキストファイル

このファイルは Claude Code および AI エージェントが本リポジトリを理解するためのコンテキストファイルです。

## プロジェクト概要

**profile-chat-ai-docs** は、AIチャット搭載ポートフォリオアプリ「profile-chat-ai」のプロジェクト横断ドキュメントを管理するリポジトリです。アプリ本体のコードは含まず、**設計ドキュメント** のみを管理します。

## システム構成サマリ（現在の実装）

```
ユーザー
  │
  ▼
Next.js (App Router)  ← フロントエンド + BFF
  │  Tailwind CSS + DaisyUI
  │  Route Handlers (JSON中継)
  │
  ▼ HTTP JSON
FastAPI (Python)      ← バックエンド
  │  LLM呼び出し（現在スタブ）
  │
  └── Amazon DynamoDB
        ├── user_chat_count（日次チャット制限）
        └── user_chat_history（会話履歴）
```

詳細は [`docs/architecture/overall.md`](docs/architecture/overall.md) を参照。

## 技術スタック

| レイヤー | 技術 | 備考 |
|---------|------|------|
| フロントエンド | Next.js 14+ (App Router / TypeScript) | `src/app/` 構成 |
| UI / CSS | Tailwind CSS v4 + DaisyUI | `chat-bubble` 等の意味論的クラス |
| BFF | Next.js Route Handlers | Python API への JSON 中継 |
| バックエンド | FastAPI (Python) | セッション管理 + チャット制限 |
| LLM | **未実装（スタブ）** | Bedrock + Claude で実装予定 |
| 永続化 | Amazon DynamoDB | チャットカウント + 会話履歴 |
| インフラ定義 | AWS CDK (TypeScript) | DynamoDB + IAM を定義済み |

## ツールチェーン規約

- **Python**: `uv` で管理（`pyproject.toml` + `uv.lock`）
- **Node.js**: `fnm` で管理（`.node-version`）
- **パッケージマネージャ**: Python は `uv`, Node は `pnpm`

## ドキュメント構造

本リポジトリにはプロジェクト横断のドキュメントのみ配置。リポジトリ固有のドキュメントは各リポジトリの `/docs/` を参照。

```
docs/
├── architecture/
│   └── overall.md          # システム全体構成
└── future/                 # 将来設計（未実装）
    ├── rag-pipeline.md     # 低コスト RAG 設計
    └── streaming-spec.md   # SSE ストリーミング仕様
```

### 各リポジトリのドキュメント

- `profile-chat-ai-fe/docs/ui-design.md` — DaisyUI チャット UI 設計指針
- `profile-chat-ai-infra/docs/aws-resources.md` — AWS リソース設計
- `profile-chat-ai-infra/docs/cdk-guide.md` — CDK 戦略

## 重要な設計方針

1. **コスト優先**: 低コストで運用可能な構成を選択する（Bedrock Haiku、S3 Vectors 等を予定）
2. **サーバーレス**: Lambda Web Adapter (LWA) で FastAPI をサーバーレス化予定
3. **状態管理**: DynamoDB でチャット回数・履歴を管理
4. **UI の開発効率**: DaisyUI の意味論的クラスで Tailwind 単体より高速に実装

## ドキュメント管理方針

- **本リポジトリ**: プロジェクト横断の設計情報のみ
- **各リポジトリ `/docs/`**: そのリポジトリに閉じた仕様
- **各リポジトリ README**: clone して動かすまでに必要な情報
- **`docs/future/`**: 未実装の将来設計（実装時に `docs/` 直下へ移動）
