# profile-chat-ai-docs

AIチャット搭載ポートフォリオアプリケーションのプロジェクト横断ドキュメント管理リポジトリです。

## 概要

本プロジェクトは、Next.js（BFF）と FastAPI を組み合わせたチャットアプリの開発を目的としています。
このリポジトリはプロジェクト横断の設計ドキュメントを管理します。リポジトリ固有のドキュメントは各リポジトリの `/docs/` に配置しています。

## 技術スタック

- **Frontend/BFF**: Next.js (App Router) + Tailwind CSS + DaisyUI
- **Backend**: FastAPI (Python)
- **Database**: Amazon DynamoDB
- **LLM**: 未実装（Bedrock + Claude で実装予定）
- **Infrastructure**: AWS CDK (TypeScript)
- **Documentation**: Markdown, Mermaid.js

## ドキュメント構成

本リポジトリには **プロジェクト横断のドキュメント** を配置しています。リポジトリ固有のドキュメントは各リポジトリの `/docs/` を参照してください。

### 本リポジトリのドキュメント

- **[CLAUDE.md](./CLAUDE.md)**: AIエージェント（Claude Code等）が開発時に参照するコンテキストファイル。
- **[Architecture / システム全体構成](./docs/architecture/overall.md)**: Next.js・FastAPI を組み合わせたシステム全体のアーキテクチャ図。

### 将来設計ドキュメント（未実装）

- **[RAG パイプライン設計](./docs/future/rag-pipeline.md)**: S3 Vectors + Bedrock Knowledge Bases による低コスト RAG 設計。
- **[SSE ストリーミング実装仕様](./docs/future/streaming-spec.md)**: FastAPIエンドポイントおよびBFF間のSSEインターフェース定義。

### 各リポジトリのドキュメント

- **[profile-chat-ai-fe](https://github.com/ktr11/profile-chat-ai-fe)**: フロントエンド UI 設計指針 → [`docs/ui-design.md`](https://github.com/ktr11/profile-chat-ai-fe/blob/main/docs/ui-design.md)
- **[profile-chat-ai-infra](https://github.com/ktr11/profile-chat-ai-infra)**: AWS リソース設計 → [`docs/aws-resources.md`](https://github.com/ktr11/profile-chat-ai-infra/blob/main/docs/aws-resources.md)、CDK ガイド → [`docs/cdk-guide.md`](https://github.com/ktr11/profile-chat-ai-infra/blob/main/docs/cdk-guide.md)
- **[profile-chat-ai-api](https://github.com/ktr11/profile-chat-ai-api)**: API 仕様 → [`docs/openapi.json`](https://github.com/ktr11/profile-chat-ai-api/blob/main/docs/openapi.json)

## リポジトリ一覧

| リポジトリ | 役割 |
|---|---|
| [profile-chat-ai-docs](https://github.com/ktr11/profile-chat-ai-docs) | プロジェクト横断ドキュメント（本リポ） |
| [profile-chat-ai-fe](https://github.com/ktr11/profile-chat-ai-fe) | Next.js フロントエンド + BFF |
| [profile-chat-ai-api](https://github.com/ktr11/profile-chat-ai-api) | FastAPI バックエンド |
| [profile-chat-ai-infra](https://github.com/ktr11/profile-chat-ai-infra) | AWS CDK インフラ定義 |
| [profile-chat-ai-skills](https://github.com/ktr11/profile-chat-ai-skills) | Claude Code 共通スキル |
