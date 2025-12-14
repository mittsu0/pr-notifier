# PR Notifier

GitHub GraphQL API を使用してレビュー待ちの Pull Request を取得し、Slack Webhook で通知するツールです。

## 機能

- GitHub GraphQL API でレビュー待ち PR を検索
- Slack Incoming Webhook で通知
- メンション機能（ユーザー、グループ、here、channel）

## 実行方法

### Docker Compose

```bash
docker compose run --rm app
```

### ローカル実行

```bash
# 依存関係のインストール
npm install

# 開発モード（TypeScript直接実行）
npm run dev

# または、ビルドして実行
npm run build
npm run start
```

## 通知例

```
@user 🔔 レビュー待ちのPRがあります (2件)

• Feature/add-new-feature
  📁 my-repository

• Fix/bug-fix
  📁 another-repository
```

## 開発

```bash
# 型チェック
npm run typecheck

# ビルド
npm run build
```
