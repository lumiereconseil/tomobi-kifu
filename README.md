# ともに寄付 / Give Together

**公開中のサイト：** https://lumiereconseil.github.io/tomobi-kifu/

- [令和8年熊本地震の寄付先（義援金・自治体・支援団体）](https://lumiereconseil.github.io/tomobi-kifu/ja/disasters/kumamoto-2026-earthquake/)
- [千葉の豪雨・台風第25号の寄付先（千葉県・千葉市の義援金）](https://lumiereconseil.github.io/tomobi-kifu/ja/disasters/chiba-2026-flood/)
- [全国の児童養護施設への寄付](https://lumiereconseil.github.io/tomobi-kifu/ja/causes/childrens-homes/)
- [義援金・支援金・ふるさと納税の違い](https://lumiereconseil.github.io/tomobi-kifu/ja/guide/)
- English: [Give Together](https://lumiereconseil.github.io/tomobi-kifu/en/)

Lumière Conseil の新規事業。日本国内と世界の自治体・福祉施設・災害支援への寄付をつなぐプラットフォーム（Next.js + Stripe Checkout / Connect）。日本語・英語対応。

寄付先には2種類あります（`lib/recipients.ts` の `payment`）：
- **direct**：日本国内の法人（社会福祉法人・NPO法人など）。このサイトで決済し、Stripe Connect で受取先の口座へ直接入金。
- **external**：自治体・義援金・海外の団体。公式の寄付ページへリンクするだけで、決済はしない。

## できること

- 寄付先一覧（カテゴリ：自治体／福祉施設／災害支援、地域：日本国内／海外で絞り込み）
- 寄付先ごとの詳細ページと寄付フォーム（1回／毎月、JPY／USD、応援メッセージ、匿名）
- Stripe Checkout での決済、Stripe Connect で受取先に直接入金（`stripeAccountId` を設定した受取先）
- 事務手数料 10%（`PLATFORM_FEE_PERCENT`、受取先ごとに `feePercent` で上書き可）を application fee として Lumière Conseil が受け取る。寄付者が手数料を上乗せ負担するチェック（初期値オン）、月額寄付が初期選択
- 災害の緊急支援ページ：受取先に `emergency: { since }` と `feePercent: 5` を設定するとトップ最上部に表示され手数料5%
- 企業マッチング表示：受取先に `matching: { sponsor, capJpy }` を設定
- 管理画面 `/admin`（`ADMIN_TOKEN` でログイン）：今月の寄付額・事務手数料・手取り見込み・目標（月1,000万円）の進捗、掲載申請の承認/却下と Stripe 口座登録リンクの発行
- Webhook で寄付を記録し、集まった金額・支援者数・最近の応援メッセージを表示（`DATABASE_URL` があれば Postgres、なければメモリ）
- 掲載申請フォーム（`/apply`）と、審査後に運営者が Connect の口座登録リンクを発行する API（`/api/connect/onboard`、`ADMIN_TOKEN` 必須）
- サイトマップ・robots・hreflang、自動テスト（`npm test`）
- 寄付金の流れ、掲載希望団体向け、運営者情報・規約ページ

## 掲載の流れ（運営者）

1. 団体が `/apply` から申請 → `applications` テーブルに保存
2. 運営者が審査し、承認したら口座登録リンクを発行：
   ```bash
   curl -X POST https://<サイト>/api/connect/onboard -H "x-admin-token: $ADMIN_TOKEN" \
     -H "content-type: application/json" -d '{"applicationId": 1, "email": "org@example.org"}'
   ```
3. 返ってきた URL を団体に送り、Stripe の登録を完了してもらう
4. 発行された `acct_...` を `lib/recipients.ts` の該当受取先の `stripeAccountId` に設定して掲載

## 動かし方

```bash
npm install
cp .env.example .env.local   # Stripe のテストキーを入れる（空ならデモモード）
npm run dev                  # http://localhost:3000 → /ja にリダイレクト
```

`STRIPE_SECRET_KEY` が空のときはデモモードで、決済せずに完了ページへ進みます。

Webhook をローカルで試す場合：

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## 構成

| パス | 内容 |
| --- | --- |
| `lib/recipients.ts` | 寄付先データ（実在団体への案内。サンプルは NEXT_PUBLIC_DEMO_SAMPLES=1 のときのみ） |
| `lib/i18n.ts` | 日英の文言 |
| `lib/db.ts`, `db/schema.sql` | 寄付・申請の保存（Postgres またはメモリ） |
| `app/api/applications` | 掲載申請の受付 |
| `app/api/connect/onboard` | 審査後の Stripe Connect 口座作成と登録リンク発行（運営者用） |
| `tests/` | Vitest のテスト |
| `lib/donation.ts` | 金額プリセット・上下限・通貨 |
| `app/api/checkout/route.ts` | Checkout セッション作成 |
| `app/api/webhooks/stripe/route.ts` | 決済完了イベントの受信 |
| `app/[locale]/...` | 各ページ |
| `docs/legal-notes.md` | 寄付を集める際の法務・運営上の注意点と設計判断 |

## 公開前に必要なこと

1. 決済を始める場合は、提携・審査済みの団体を direct で登録する
2. 運営者情報は `lib/site.ts` に設定済み（環境変数 `OPERATOR_NAME` / `CONTACT_EMAIL` / `CONTACT_PHONE` で上書き可）
3. Postgres を用意して `db/schema.sql` を流し、`DATABASE_URL` を設定する
4. Stripe のプラットフォーム審査と各受取先の Connect アカウント作成
5. 専門家による規約・資金の流れの確認（`docs/legal-notes.md` 参照）
6. ホスティング（例：Vercel）へデプロイし、`NEXT_PUBLIC_SITE_URL` を本番 URL に設定

## 公開（Vercel）

1. このリポジトリを GitHub に置く
2. https://vercel.com に GitHub でサインインし、「Add New → Project」でリポジトリを Import → Deploy
3. 環境変数（Project → Settings → Environment Variables）：
   - `NEXT_PUBLIC_SITE_URL`：公開URL（例 `https://tomoni-kifu.vercel.app`）
   - 決済はまだ使わないので `STRIPE_*` は設定しない。`NEXT_PUBLIC_DEMO_SAMPLES` も設定しない（架空のサンプルが出ます）
4. 変数を変えたら Deployments から Redeploy

公開版の掲載団体はすべて公式寄付ページへの案内（`payment.mode = "external"`、`partner: false`）で、当サイトでは決済しません。

## GitHub Pages（静的版）

`main` に push すると GitHub Actions（`.github/workflows/pages.yml`）が `node scripts/build-pages.mjs` で静的版を書き出し、`gh-pages` ブランチへ公開します。公開先: https://lumiereconseil.github.io/tomobi-kifu/

静的版はサーバーがないため、決済・管理画面・API・申請フォーム・絞り込みは含みません（掲載団体は公式ページへのリンクで案内）。これらが必要になったら Vercel など Next.js が動くホストへ移します。
