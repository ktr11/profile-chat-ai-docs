# ローカル開発環境構築手順

## 前提環境

- **OS**: Windows 11 + WSL2 (Ubuntu 22.04 推奨)
- **Python 管理**: `uv`
- **Node.js 管理**: `fnm`
- **AWS CLI**: v2
- **Docker**: Docker Desktop (WSL2 統合有効)

## 1. WSL2 のセットアップ

```powershell
# PowerShell (管理者) で実行
wsl --install -d Ubuntu-22.04
wsl --set-default-version 2
```

```bash
# WSL2 内でシステム更新
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y build-essential curl git
```

## 2. uv のインストール（Python 管理）

`uv` は Rust 製の高速 Python パッケージマネージャです。`pip` + `virtualenv` + `pyenv` の代替として機能します。

```bash
# uv インストール
curl -LsSf https://astral.sh/uv/install.sh | sh
source ~/.bashrc  # または ~/.zshrc

# バージョン確認
uv --version
```

### Python プロジェクトの初期化

```bash
# Python 3.12 をインストールして使用
uv python install 3.12
uv python pin 3.12

# 依存関係の追加
uv add fastapi langchain-aws langgraph langgraph-checkpoint-aws

# 開発用依存関係
uv add --dev pytest ruff mypy

# 仮想環境の有効化
source .venv/bin/activate

# スクリプト実行
uv run python -m app.main
uv run uvicorn app.main:app --reload
```

## 3. fnm のインストール（Node.js 管理）

`fnm` (Fast Node Manager) は Rust 製の高速 Node.js バージョンマネージャです。

```bash
# fnm インストール
curl -fsSL https://fnm.vercel.app/install | bash
source ~/.bashrc

# バージョン確認
fnm --version

# Node.js 20 LTS のインストール
fnm install 20
fnm use 20
fnm default 20

# .node-version ファイルで固定
echo "20" > .node-version
fnm use  # .node-version を自動読み込み
```

### Node.js プロジェクトの初期化

```bash
# Next.js プロジェクト作成
npx create-next-app@latest profile-chat-ai \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*"

cd profile-chat-ai

# DaisyUI インストール
npm install daisyui

# pnpm 使用の場合（推奨）
npm install -g pnpm
pnpm install
pnpm add daisyui
```

## 4. AWS CLI のセットアップ

```bash
# AWS CLI v2 インストール
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# バージョン確認
aws --version

# 認証設定（IAM Identity Center 推奨）
aws configure sso
# SSO URL, リージョン, プロファイル名を入力

# または直接設定（開発環境のみ）
aws configure
# Access Key ID, Secret Access Key, Region (us-east-1) を入力
```

### Bedrock モデルアクセスの有効化

```bash
# Bedrock コンソールでモデルアクセスを申請（初回のみ）
# 対象モデル:
# - anthropic.claude-haiku-3-5-v1:0
# - amazon.titan-embed-text-v2:0

# アクセス確認
aws bedrock list-foundation-models \
  --region us-east-1 \
  --by-provider Anthropic \
  --query "modelSummaries[?modelId=='anthropic.claude-haiku-3-5-v1:0']"
```

## 5. ローカル開発サーバーの起動

### FastAPI バックエンド

```bash
cd profile-chat-api  # バックエンドリポジトリ

# 環境変数設定
cp .env.example .env
# .env を編集:
# AWS_DEFAULT_REGION=us-east-1
# DYNAMODB_TABLE=profile-chat-checkpoints-dev
# S3_BUCKET=profile-chat-ai-state-local

# 開発サーバー起動
uv run uvicorn app.main:app --reload --port 8000
```

### Next.js フロントエンド

```bash
cd profile-chat-ai  # フロントエンドリポジトリ

# 環境変数設定
cp .env.local.example .env.local
# PYTHON_API_URL=http://localhost:8000

# 開発サーバー起動
pnpm dev
# または
npm run dev
```

## 6. DynamoDB Local（オプション）

AWS への接続なしでローカルテストする場合は DynamoDB Local を使用します。

```bash
# Docker で DynamoDB Local 起動
docker run -p 8001:8000 amazon/dynamodb-local

# テーブル作成
aws dynamodb create-table \
  --table-name profile-chat-checkpoints-dev \
  --attribute-definitions \
    AttributeName=thread_id,AttributeType=S \
    AttributeName=checkpoint_id,AttributeType=S \
  --key-schema \
    AttributeName=thread_id,KeyType=HASH \
    AttributeName=checkpoint_id,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --endpoint-url http://localhost:8001
```

## 7. CDK ローカル実行

```bash
cd infra/cdk

# Node.js 依存関係インストール
pnpm install

# TypeScript コンパイル確認
npx tsc --noEmit

# ドライラン（実際のデプロイなし）
npx cdk synth ProfileChatData-Dev
npx cdk diff ProfileChatData-Dev
```

## トラブルシューティング

### WSL2 から AWS に接続できない

```bash
# DNS 解決の確認
cat /etc/resolv.conf

# WSL2 の DNS 設定修正
sudo bash -c 'echo "[network]
generateResolvConf = false" >> /etc/wsl.conf'
sudo bash -c 'echo "nameserver 8.8.8.8" > /etc/resolv.conf'
```

### Bedrock スロットリング

```bash
# 出力トークン数を制限してスロットリングを回避
export CLAUDE_CODE_MAX_OUTPUT_TOKENS=4096
```

### fnm コマンドが見つからない

```bash
# .bashrc / .zshrc に以下を追加
eval "$(fnm env --use-on-cd)"
```

## 関連ドキュメント

- [システム全体構成](../architecture/overall.md)
- [AWS リソース設計](../infrastructure/aws-resources.md)
- [CDK ガイド](../infrastructure/cdk-guide.md)
