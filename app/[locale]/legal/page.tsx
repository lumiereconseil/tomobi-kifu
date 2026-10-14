import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { operator } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? pageMetadata(locale, "/legal", { title: getDictionary(locale).legal }) : {};
}

const content: Record<Locale, { title: string; rows: [string, string][]; sections: [string, string][] }> = {
  ja: {
    title: "運営者情報・特定商取引法に基づく表記",
    rows: [
      ["事業者", `${operator.tradeName}（個人事業）`],
      ["運営責任者", operator.name],
      ["所在地", "請求があれば遅滞なく開示します"],
      ["電話番号", operator.phone],
      ["連絡先", operator.email],
      ["寄付金額", "各寄付ページで寄付者が指定した金額"],
      ["事務手数料", "お支払い額の10%（災害の緊急支援は5%、決済手数料を含む）。寄付者が手数料を負担する場合は寄付額に上乗せしてお支払いいただきます。残りは受取先へ直接入金されます"],
      ["寄付金の受取", "寄付金は Stripe Connect を通じて受取先の口座へ直接入金されます。Lumière Conseil は寄付金を預かりません"],
      ["支払方法", "クレジットカード等（Stripe）"],
      ["支払時期", "決済完了時（毎月の寄付は毎月の同日）"],
      ["返金", "寄付の性質上、原則として返金できません。誤って寄付した場合は7日以内にご連絡ください。"],
      ["毎月の寄付の停止", "確認メールのリンク、または上記連絡先からいつでも停止できます。"],
    ],
    sections: [
      ["プライバシー", "寄付者の氏名・メールアドレスは決済処理と受取先への寄付報告のためにのみ使用し、匿名を選んだ場合は受取先にも氏名を公開しません。"],
      ["受取先の責任", "寄付金の使途と領収書の発行は各受取先が責任を負います。運営者は掲載前の審査と、使途報告の公開を行います。"],
    ],
  },
  en: {
    title: "Operator information & legal notice",
    rows: [
      ["Operator", `${operator.tradeName} (sole proprietorship)`],
      ["Responsible person", operator.name],
      ["Address", "Disclosed without delay on request"],
      ["Phone", operator.phone],
      ["Contact", operator.email],
      ["Amount", "The amount chosen by the donor on each donation page"],
      ["Administrative fee", "10% of each payment (5% for disaster emergency appeals), including card processing. If the donor chooses to cover it, it is added on top of the gift. The rest is paid directly to the recipient"],
      ["Where donations go", "Paid via Stripe Connect directly into the recipient's own account. Lumière Conseil never holds donated funds"],
      ["Payment", "Credit card and other methods via Stripe"],
      ["Timing", "On completion of checkout (monthly gifts recur on the same day each month)"],
      ["Refunds", "Donations are generally non-refundable. If you donated by mistake, contact us within 7 days."],
      ["Cancelling monthly gifts", "Cancel any time via the link in your confirmation email or the contact above."],
    ],
    sections: [
      ["Privacy", "Donor names and emails are used only to process payments and report gifts to recipients. If you choose anonymity, your name is not shared with the recipient."],
      ["Recipient responsibility", "Each recipient is responsible for how funds are used and for issuing receipts. The operator vets recipients before listing and publishes their reports."],
    ],
  },
};

export default async function Legal({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = content[locale];
  return (
    <div className="container section prose">
      <h1>{c.title}</h1>
      <table className="info-table">
        <tbody>
          {c.rows.map(([k, v]) => (
            <tr key={k}>
              <th>{k}</th>
              <td>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {c.sections.map(([h, p]) => (
        <section key={h}>
          <h2>{h}</h2>
          <p>{p}</p>
        </section>
      ))}
    </div>
  );
}
