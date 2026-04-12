# リポジトリ初期セットアップ

あなたはシニアクラウドアーキテクト兼AIエンジニアとして、AIポートフォリオアプリの設計図およびドキュメントを管理するリポジトリ「profile-chat-ai-docs」をゼロから構築してください。

このリポジトリは、以下の技術スタックと設計思想を持つWebアプリの「真実の源（Single Source of Truth）」となります。

### 1. プロジェクトの技術スタック
*   **フロントエンド**: Next.js (App Router / TypeScript)
*   **UI/CSS**: Tailwind CSS + **DaisyUI**（チャットUIの効率的な構築とテーマ管理のため）
*   **BFF**: Next.js Route Handlers (Python APIからのSSEストリーミングを中継)
*   **AIバックエンド**: FastAPI + LangGraph (Python版)
*   **インフラ**: AWS (Bedrock, DynamoDB, S3 Vectors, Lambda Web Adapter)

### 2. 環境セットアップ手順
以下の手順を自律的に実行してください：
1.  現在のディレクトリで `git init` を実行し、リポジトリを初期化する。
2.  Python管理に `uv`、Node.js管理に `fnm` を使用することを前提としたプロジェクト設定を行う。
3.  `/init` コマンドを実行し、エージェント用の基本コンテキストファイル（`CLAUDE.md`）を生成する。

### 3. リポジトリ構造とドキュメントの作成
以下のディレクトリ構造を作成し、詳細な設計ドキュメントを配置してください。

*   **`/docs/architecture`**
    *   `overall.md`: システム全体構成図（Next.js BFF + Python APIの連携フロー）
    *   `rag-pipeline.md`: Amazon S3 Vectors + Bedrock Knowledge Basesを用いた「月額数円〜」の低コストRAG構成
*   **`/docs/frontend`**
    *   `ui-design.md`: **Tailwind CSSとDaisyUI**を活用したチャットUIの設計指針（`chat-bubble`コンポーネントの使用やダークモード対応など）
*   **`/docs/api`**
    *   `streaming-spec.md`: FastAPIの `StreamingResponse` とNext.jsの `ReadableStream` を用いたエンドツーエンドのストリーミング実装仕様
*   **`/docs/infrastructure`**
    *   `aws-resources.md`: Bedrock Haiku 3.5の採用理由、DynamoDBチェックポインター（`langgraph-checkpoint-aws`）、S3 Vectorsのコスト効率
    *   `cdk-guide.md`: AWS CDKを用いたインフラ定義の戦略
*   **`/docs/development`**
    *   `local-setup.md`: WSL2, uv, fnm, aws-cli を用いた開発環境の構築手順
*   **`/infra/cdk`**
    *   CDK（TypeScript）のディレクトリ構造のみ作成

### 4. 記述すべき重要事項
ドキュメント内には必ず以下の内容を反映させてください：
*   **DaisyUIの採用**: Tailwind CSS単体よりも「お手軽」かつ「今風」なUIを、意味論的なクラス名（`btn`, `chat-start`等）で構築するメリット。
*   **LangGraphの永続化**: DynamoDBを使用したセッション管理と、状態が350KBを超えた際のS3オフローディング設計。
*   **Bedrockの最適化**: `CLAUDE_CODE_MAX_OUTPUT_TOKENS=4096` 設定など、Bedrock特有のスロットリング対策。
*   **AWSサーバーレス**: Lambda Web Adapter (LWA) を活用し、FastAPIをサーバーレスで動かす経済的メリット。

### 5. 実行指示
上記の内容に基づき、ディレクトリの作成、ドキュメントの執筆、および最後に `feat: initial repository setup with DaisyUI and AWS design` というメッセージでの初期コミットまでを完了させてください。作業開始前に、設計ドキュメントの目次構成を検討し、その思考過程をログに出力してください。

