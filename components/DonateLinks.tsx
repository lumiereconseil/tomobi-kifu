import { formatMoney } from "@/lib/donation";
import type { Locale } from "@/lib/i18n";
import type { PaymentLinks } from "@/lib/payment-links";

/** Donation buttons that open Stripe's hosted payment page (works without a server). */
export function DonateLinks({ links, locale, feePercent }: { links: PaymentLinks; locale: Locale; feePercent: number }) {
  const ja = locale === "ja";
  return (
    <div className="donate-links">
      {links.test && (
        <p className="notice">{ja ? "テストモードです。実際の決済は行われません。" : "Test mode. No real payment will be made."}</p>
      )}
      <h3>{ja ? "毎月寄付する" : "Give monthly"}</h3>
      <div className="donate-link-row">
        {links.monthly.map((m) => (
          <a key={m.url} href={m.url} className="btn btn-primary" rel="noopener">
            {formatMoney(m.amountJpy, "jpy", locale)}
            {ja ? " / 月" : " / mo"}
          </a>
        ))}
      </div>
      <h3>{ja ? "1回だけ寄付する" : "Give once"}</h3>
      <div className="donate-link-row">
        {links.once.map((o) => (
          <a key={o.url} href={o.url} className="btn" rel="noopener">
            {formatMoney(o.amountJpy, "jpy", locale)}
          </a>
        ))}
      </div>
      <p className="small muted">
        {ja
          ? `決済は Stripe の安全なページで行います。寄付は団体の口座に直接入り、うち${feePercent}%が事務手数料（Lumière Conseil）です。`
          : `Payment is handled on Stripe's secure page. Your gift goes straight to the organisation; ${feePercent}% is our administrative fee (Lumière Conseil).`}
      </p>
    </div>
  );
}
