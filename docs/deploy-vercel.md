# サイトで寄付を受け付ける（Vercel へ公開）

GitHub Pages の公開サイトは表示だけで、決済は動きません。寄付を受け付けるには、サーバーのある Vercel にこのリポジトリを公開します。Next.js の標準構成なので、設定ファイルの追加は不要です。

## Masa さんが行うこと

1. Stripe のアカウントを作る（[stripe-live-checklist.md](stripe-live-checklist.md) の 1）。最初はテストモードのキー（`sk_test_...`）だけ使います。
2. vercel.com に GitHub アカウントでログインし、「Add New → Project」で `lumiereconseil/tomobi-kifu` を選ぶ。設定は既定のまま「Deploy」。
3. Vercel の Settings → Environment Variables に次を入れて、もう一度デプロイする。

| 変数 | 値 |
| --- | --- |
| `STRIPE_SECRET_KEY` | Stripe の「開発者 → API キー」のテスト用シークレットキー |
| `NEXT_PUBLIC_SITE_URL` | Vercel が出した `https://...vercel.app` |
| `ADMIN_TOKEN` | 長いランダム文字列（`openssl rand -hex 32`） |
| `PLATFORM_FEE_PERCENT` | `10` |

`STRIPE_WEBHOOK_SECRET` と `DATABASE_URL` は、[stripe-live-checklist.md](stripe-live-checklist.md) の 2〜3 の手順で追加します。

## そのあと（Claude が行うこと）

- テストカードで寄付の流れを一通り確認する。
- 受取先として参加に同意した団体に、Stripe の口座登録リンクを発行する（README の「掲載の流れ」）。登録が済んだ団体から `payment: { mode: "direct" }` に切り替え、サイト上の寄付フォームが表示されます。
- 本番キー（`sk_live_...`）に切り替える前に、Masa さんの GO をもらう。

## 寄付金の流れ

寄付は Stripe Connect で受取先の団体の口座に直接入り、手数料（10%、災害の緊急支援は5%）だけが Lumière Conseil に入ります。運営者が寄付金を預からない設計です（[legal-notes.md](legal-notes.md) §1）。県・市への寄附と日本赤十字社などの義援金は、これまでどおり公式ページへのリンクです。
