# profile-chat-ai-docs

AIエージェント搭載ポートフォリオアプリケーションの設計・仕様ドキュメント管理リポジトリです。

## 概要

本プロジェクトは、Next.js（BFF）とFastAPI + LangGraph（AI Agent）を組み合わせた、AIエージェント搭載型のポートフォリオアプリの開発を目的としています。
このリポジトリは「プロジェクトの真実の源」として機能し、アーキテクチャ、API仕様、インフラ設計、および開発環境の手順を中央管理します。

## 技術スタック

- **Frontend/BFF**: Next.js (App Router)
- **AI Backend**: FastAPI, LangGraph (AIエージェント制御)
- **Model**: Claude 3.5 Sonnet / 4.6 Sonnet (Amazon Bedrock)
- **Infrastructure**: AWS (Lamba / App Runner / ECS 等想定)
- **Documentation**: Markdown, Mermaid.js

## ドキュメント構成

本リポジトリには **プロジェクト横断のドキュメント** を配置しています。リポジトリ固有のドキュメントは各リポジトリの `/docs/` を参照してください。

### 本リポジトリのドキュメント

- **[CLAUDE.md](./CLAUDE.md)**: **プロジェクトの憲法**。AIエージェント（Claude Code等）が開発時に参照するビルドコマンド、コーディング規約、技術スタックの制約を定義しています。
- **[Architecture / システム全体構成](./docs/architecture/overall.md)**: Next.js・FastAPI・Bedrockを組み合わせたシステム全体のアーキテクチャ図。
- **[Architecture / 低コスト RAG パイプライン設計](./docs/architecture/rag-pipeline.md)**: S3 Vectors + Bedrock Knowledge Bases による低コスト RAG 設計。
- **[API / SSE ストリーミング実装仕様](./docs/api/streaming-spec.md)**: FastAPIエンドポイントおよびBFF間のSSEインターフェース定義。

### 各リポジトリのドキュメント

- **[profile-chat-ai-fe](https://github.com/ktr11/profile-chat-ai-fe)**: フロントエンド UI 設計指針 → [`docs/ui-design.md`](https://github.com/ktr11/profile-chat-ai-fe/blob/main/docs/ui-design.md)
- **[profile-chat-ai-infra](https://github.com/ktr11/profile-chat-ai-infra)**: AWS リソース設計 → [`docs/aws-resources.md`](https://github.com/ktr11/profile-chat-ai-infra/blob/main/docs/aws-resources.md)、CDK ガイド → [`docs/cdk-guide.md`](https://github.com/ktr11/profile-chat-ai-infra/blob/main/docs/cdk-guide.md)

## AIエージェントとの協調開発

本プロジェクトでは、AIエージェントが効率的かつ一貫性を持って開発を行えるよう、`CLAUDE.md` を中心としたコンテキスト管理を行っています。開発者は、新しい機能の実装や修正の際、まず `CLAUDE.md` のルールを確認・更新することを推奨します。

### 基本コマンド
- `npm run dev` (Frontend)
- `pytest` (Backend)
- `gh` (GitHub CLIを用いた操作)
