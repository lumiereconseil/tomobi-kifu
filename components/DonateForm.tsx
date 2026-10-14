"use client";

import { useState } from "react";
import { feeBreakdownDisplay, formatMoney, limits, presets, type Currency } from "@/lib/donation";
import type { Locale } from "@/lib/i18n";

type Labels = {
  amount: string;
  currency: string;
  otherAmount: string;
  frequency: string;
  once: string;
  monthly: string;
  message: string;
  anonymous: string;
  proceed: string;
  processing: string;
  coverFee: string;
  breakdown: string;
  total: string;
  invalidAmount: string;
  error: string;
};

export function DonateForm({
  slug,
  locale,
  feePercent,
  labels,
}: {
  slug: string;
  locale: Locale;
  feePercent: number;
  labels: Labels;
}) {
  const [currency, setCurrency] = useState<Currency>(locale === "ja" ? "jpy" : "usd");
  const [amount, setAmount] = useState<number>(presets[currency][1]);
  const [custom, setCustom] = useState("");
  const [frequency, setFrequency] = useState<"once" | "monthly">("monthly");
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [coverFee, setCoverFee] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const value = custom ? Number(custom) : amount;
  const { min, max } = limits[currency];
  const valid = Number.isFinite(value) && value >= min && value <= max;
  const split = feeBreakdownDisplay(valid ? value : 0, currency, feePercent, coverFee);
  const money = (n: number) => formatMoney(n, currency, locale);

  function switchCurrency(c: Currency) {
    setCurrency(c);
    setAmount(presets[c][1]);
    setCustom("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return setError(labels.invalidAmount);
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, amount: value, currency, frequency, message, anonymous, locale, coverFee }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "error");
      window.location.href = data.url;
    } catch {
      setError(labels.error);
      setBusy(false);
    }
  }

  return (
    <form className="donate-form" onSubmit={submit}>
      <fieldset>
        <legend>{labels.frequency}</legend>
        <div className="segmented">
          {(["once", "monthly"] as const).map((f) => (
            <button
              type="button"
              key={f}
              className={frequency === f ? "active" : ""}
              aria-pressed={frequency === f}
              onClick={() => setFrequency(f)}
            >
              {labels[f]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>{labels.currency}</legend>
        <div className="segmented">
          {(["jpy", "usd"] as const).map((c) => (
            <button
              type="button"
              key={c}
              className={currency === c ? "active" : ""}
              aria-pressed={currency === c}
              onClick={() => switchCurrency(c)}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>{labels.amount}</legend>
        <div className="amount-grid">
          {presets[currency].map((p) => (
            <button
              type="button"
              key={p}
              className={!custom && amount === p ? "active" : ""}
              aria-pressed={!custom && amount === p}
              onClick={() => {
                setAmount(p);
                setCustom("");
              }}
            >
              {formatMoney(p, currency, locale)}
            </button>
          ))}
        </div>
        <label className="field">
          <span>{labels.otherAmount}</span>
          <input
            type="number"
            inputMode="decimal"
            min={min}
            max={max}
            step={currency === "jpy" ? 1 : 0.01}
            value={custom}
            placeholder={`${min}–${max}`}
            onChange={(e) => setCustom(e.target.value)}
          />
        </label>
      </fieldset>

      <label className="field">
        <span>{labels.message}</span>
        <textarea maxLength={450} rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
      </label>

      {feePercent > 0 && (
        <div className="fee-box">
          <label className="check">
            <input type="checkbox" checked={coverFee} onChange={(e) => setCoverFee(e.target.checked)} />
            {labels.coverFee.replace("{fee}", String(feePercent))}
          </label>
          {valid && (
            <p className="small muted">
              {labels.breakdown
                .replace("{total}", money(split.total))
                .replace("{recipient}", money(split.toRecipient))
                .replace("{fee}", money(split.fee))}
            </p>
          )}
        </div>
      )}

      <label className="check">
        <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
        {labels.anonymous}
      </label>

      {error && <p className="error" role="alert">{error}</p>}

      <button type="submit" className="btn btn-primary btn-block" disabled={busy || !valid}>
        {busy
          ? labels.processing
          : `${labels.proceed}${valid ? ` · ${money(split.total)}${frequency === "monthly" ? ` / ${labels.monthly}` : ""}` : ""}`}
      </button>
    </form>
  );
}
