# PR Notifier

GitHub GraphQL API を使用してレビュー待ちの Pull Request を取得し、Slack Webhook で通知するツールです。

## 機能

- GitHub GraphQL API でレビュー待ち PR を検索
- Slack Incoming Webhook で通知
- メンション機能（ユーザー、グループ、here、channel）

## 取得条件

以下の条件に合致する Pull Request を取得します：

- 指定した Organization/Owner 配下のリポジトリ
- 自分にレビューがリクエストされている（`review-requested:@me`）
- Open 状態
- Draft 以外（設定で変更可能）
- 指定日数以内に更新されたもの（設定で変更可能）

## 環境変数

<details>
<summary>環境変数一覧を表示</summary>

| 変数名               | 必須 | 説明                                            | 例                            |
| -------------------- | ---- | ----------------------------------------------- | ----------------------------- |
| `GITHUB_TOKEN`       | ✅   | GitHub Personal Access Token                    | `ghp_xxxx`                    |
| `OWNER`              | ✅   | 検索対象の Organization または Owner            | `my-org`                      |
| `SLACK_WEBHOOK_URL`  | ✅   | Slack Incoming Webhook URL                      | `https://hooks.slack.com/...` |
| `COUNT`              |      | 取得する PR の最大件数（1-100、デフォルト: 10） | `20`                          |
| `INCLUDE_DRAFT`      |      | Draft PR を含めるか（デフォルト: false）        | `true`                        |
| `IGNORE_AFTER_DAYS`  |      | 指定日数より前に更新された PR を除外            | `30`                          |
| `SLACK_MENTION_TYPE` |      | メンション種別（user/group/here/channel）       | `user`                        |
| `SLACK_MENTION_ID`   |      | メンション対象の ID（user/group の場合は必須）  | `U01234567`                   |

</details>

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

## 定期実行（macOS launchd）

macOS で launchd を使って定期的に通知を実行する設定例です。

### 1. plist ファイルの作成

`~/Library/LaunchAgents/com.github.mittsu0.pr-notifier.plist` を作成します（この例では平日 15:00 に通知）：

<details>
<summary>plist ファイルの内容を表示</summary>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.github.mittsu0.pr-notifier</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/docker</string>
        <string>compose</string>
        <string>-f</string>
        <string>/path/to/pr-notifier/compose.yml</string>
        <string>run</string>
        <string>--rm</string>
        <string>app</string>
    </array>
    <key>StartCalendarInterval</key>
    <array>
        <!-- 平日 15:00 -->
        <dict>
            <key>Weekday</key>
            <integer>1</integer>
            <key>Hour</key>
            <integer>15</integer>
            <key>Minute</key>
            <integer>0</integer>
        </dict>
        <dict>
            <key>Weekday</key>
            <integer>2</integer>
            <key>Hour</key>
            <integer>15</integer>
            <key>Minute</key>
            <integer>0</integer>
        </dict>
        <dict>
            <key>Weekday</key>
            <integer>3</integer>
            <key>Hour</key>
            <integer>15</integer>
            <key>Minute</key>
            <integer>0</integer>
        </dict>
        <dict>
            <key>Weekday</key>
            <integer>4</integer>
            <key>Hour</key>
            <integer>15</integer>
            <key>Minute</key>
            <integer>0</integer>
        </dict>
        <dict>
            <key>Weekday</key>
            <integer>5</integer>
            <key>Hour</key>
            <integer>15</integer>
            <key>Minute</key>
            <integer>0</integer>
        </dict>
    </array>
    <key>StandardOutPath</key>
    <string>/tmp/pr-notifier.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/pr-notifier.error.log</string>
</dict>
</plist>
```

</details>

> **Note**: `/path/to/pr-notifier` は実際のプロジェクトパスに置き換えてください。

### 2. launchd への登録

```bash
# plistをロード（登録、-w で永続化）
launchctl load -w ~/Library/LaunchAgents/com.github.mittsu0.pr-notifier.plist

# 動作確認（手動実行）
launchctl start com.github.mittsu0.pr-notifier

# ログの確認
tail -f /tmp/pr-notifier.log
```

### 3. その他のコマンド

```bash
# 登録解除（-w で永続的に無効化）
launchctl unload -w ~/Library/LaunchAgents/com.github.mittsu0.pr-notifier.plist

# 状態確認
launchctl list | grep pr-notifier
```

## 開発

```bash
# 型チェック
npm run typecheck

# ビルド
npm run build
```
