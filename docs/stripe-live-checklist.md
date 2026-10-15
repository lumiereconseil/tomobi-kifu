# Stripe 本番化チェックリスト

このサイトで直接寄付を受け付ける（`payment.mode: "direct"`）ための手順です。今の公開サイト（GitHub Pages）は案内のみで、決済は動きません。本番の決済はサーバーが要るため Vercel などで動かします。法的な前提は [legal-notes.md](legal-notes.md) を参照。

**ライブキーを入れる・ライブで決済するのは、Masa さんの確認を取ってからです。**

## 1. Masa さんが行うこと（アカウントが必要）

1. Stripe アカウントを作る（事業者：個人事業主「Lumière Conseil」）。本人確認・入金口座を登録する。
2. Stripe ダッシュボードで **Connect を有効化**し、プラットフォームの種類を「マーケットプレイス／プラットフォーム」、連結アカウントを **Express** にする。
3. 事業内容の説明に「寄付先の団体（日本の法人）へ直接入金するプラットフォーム。運営者は寄付金を預からず、手数料のみ受け取る」と書く。寄付・クラウドファンディングは Stripe の審査対象業種なので、審査の連絡が来たら [legal-notes.md](legal-notes.md) の内容で回答する。
4. 弁護士に「資金移動業に当たらないこと」の確認を取る（legal-notes.md §1）。
5. Vercel にこのリポジトリをつなぎ、下の環境変数を入れる。
6. Postgres（Neon か Supabase の無料枠）を作り、`db/schema.sql` を流す。

## 2. 環境変数（Vercel の Production）

| 変数 | 値 |
| --- | --- |
| `STRIPE_SECRET_KEY` | 最初は `sk_test_...`。本番は確認後に `sk_live_...`（制限付きキー `rk_live_...` 推奨） |
| `STRIPE_WEBHOOK_SECRET` | 下の Webhook 登録で出る `whsec_...` |
| `NEXT_PUBLIC_SITE_URL` | `https://` で始まる公開URL |
| `ADMIN_TOKEN` | `openssl rand -hex 32` |
| `DATABASE_URL` | Postgres の接続文字列 |
| `PLATFORM_FEE_PERCENT` | `10` |

## 3. Webhook

Stripe ダッシュボード → 開発者 → Webhook で、`<サイトURL>/api/webhooks/stripe` を登録し、次のイベントを選ぶ。

- `checkout.session.completed`（1回の寄付と、毎月寄付の初回）
- `invoice.paid`（毎月寄付の2回目以降）

## 4. 確認

```bash
node --env-file=.env.production scripts/check-live.mjs
```

環境変数、Stripe アカウントの決済・入金の有効化、未提出の情報、Webhook のイベントを読み取りだけで確認します（Stripe 側は何も変更しません）。すべて ✓ になれば準備完了です。

テストキーのまま、次の流れを一度通す。

1. `/ja/apply` から申請 → `/admin` で承認し、口座登録リンクを発行
2. テスト用の団体情報で Stripe の登録を完了
3. 発行された `acct_...` を `lib/recipients.ts` の受取先に `stripeAccountId` として入れ、`payment: { mode: "direct" }` にする
4. テストカード `4242 4242 4242 4242` で寄付 → 団体の残高に入り、手数料がプラットフォームに入ることを確認

## 5. 安全装置（コードに入っているもの）

- ライブキーのとき、`stripeAccountId` のない受取先への決済は `/api/checkout` が 409 で止める（運営者の口座に寄付金が入らない）。
- 自治体・義援金・海外の受取先は `external` のままで、サイトで決済しない。
- 手数料は受取先ごとの `feePercent`（災害の緊急支援は5%、最初の提携団体は6か月7%）。
