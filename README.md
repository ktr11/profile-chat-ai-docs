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

プロジェクトの各詳細については、以下のドキュメントを参照してください。

- **[CLAUDE.md](./CLAUDE.md)**: **プロジェクトの憲法**。AIエージェント（Claude Code等）が開発時に参照するビルドコマンド、コーディング規約、技術スタックの制約を定義しています。
- **[Architecture](./docs/architecture.md)**: LangGraphを用いたエージェントのワークフローや、Next.jsとの連携図。
- **[API Specifications](./docs/api-spec.md)**: FastAPIエンドポイントおよびBFF間のインターフェース定義。
- **[Infrastructure](./docs/infrastructure.md)**: AWS構成図およびデプロイフロー。
- **[Development Guide](./docs/development.md)**: WSL(Ubuntu)環境でのセットアップ、GitHub CLI、VSCode (HackGen) の設定手順。

## AIエージェントとの協調開発

本プロジェクトでは、AIエージェントが効率的かつ一貫性を持って開発を行えるよう、`CLAUDE.md` を中心としたコンテキスト管理を行っています。開発者は、新しい機能の実装や修正の際、まず `CLAUDE.md` のルールを確認・更新することを推奨します。

### 基本コマンド
- `npm run dev` (Frontend)
- `pytest` (Backend)
- `gh` (GitHub CLIを用いた操作)
