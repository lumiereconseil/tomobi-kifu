"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";

const labels = {
  ja: {
    heading: "申請フォーム",
    orgName: "団体名",
    category: "区分",
    categories: { municipality: "自治体", welfare: "福祉施設", disaster: "災害支援" },
    country: "国・地域",
    contactName: "担当者名",
    email: "メールアドレス",
    website: "ウェブサイト（任意）",
    description: "寄付金の使い道",
    descriptionHint: "どのような目的に、どのように使い、どう報告するかをご記入ください。",
    submit: "申請する",
    submitting: "送信中…",
    required: "必須項目を入力してください。",
    invalidEmail: "メールアドレスの形式が正しくありません。",
    invalidWebsite: "ウェブサイトは http:// または https:// から入力してください。",
    error: "送信できませんでした。時間をおいて再度お試しください。",
  },
  en: {
    heading: "Application form",
    orgName: "Organisation name",
    category: "Category",
    categories: { municipality: "Local government", welfare: "Welfare facility", disaster: "Disaster relief" },
    country: "Country",
    contactName: "Contact name",
    email: "Email",
    website: "Website (optional)",
    description: "How funds will be used",
    descriptionHint: "Describe what donations will fund, how they will be spent and how you will report back.",
    submit: "Submit application",
    submitting: "Sending…",
    required: "Please fill in all required fields.",
    invalidEmail: "Please enter a valid email address.",
    invalidWebsite: "Website must start with http:// or https://.",
    error: "Something went wrong. Please try again later.",
  },
} as const;

const categories = ["municipality", "welfare", "disaster"] as const;

export function ApplyForm({ locale }: { locale: Locale }) {
  const l = labels[locale];
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (!data.orgName?.trim() || !data.country?.trim() || !data.contactName?.trim() || !data.email?.trim() || !data.description?.trim()) {
      return setError(l.required);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) return setError(l.invalidEmail);
    if (data.website?.trim() && !/^https?:\/\/\S+$/i.test(data.website.trim())) return setError(l.invalidWebsite);

    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("request_failed");
      window.location.href = `/${locale}/apply/done`;
    } catch {
      setError(l.error);
      setBusy(false);
    }
  }

  return (
    <form className="apply-form" onSubmit={submit} noValidate>
      <h2>{l.heading}</h2>
      <label className="field">
        {l.orgName} *
        <input name="orgName" required maxLength={200} autoComplete="organization" />
      </label>
      <label className="field">
        {l.category} *
        <select name="category" required defaultValue="municipality">
          {categories.map((c) => (
            <option key={c} value={c}>
              {l.categories[c]}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        {l.country} *
        <input name="country" required maxLength={100} defaultValue={locale === "ja" ? "日本" : ""} autoComplete="country-name" />
      </label>
      <label className="field">
        {l.contactName} *
        <input name="contactName" required maxLength={100} autoComplete="name" />
      </label>
      <label className="field">
        {l.email} *
        <input name="email" type="email" required maxLength={254} autoComplete="email" />
      </label>
      <label className="field">
        {l.website}
        <input name="website" type="url" maxLength={500} placeholder="https://" autoComplete="url" />
      </label>
      <label className="field">
        {l.description} *
        <textarea name="description" required maxLength={4000} rows={6} placeholder={l.descriptionHint} />
      </label>
      {/* Honeypot: hidden from people, often filled in by bots. */}
      <div className="hp" aria-hidden="true">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="btn btn-primary" disabled={busy}>
        {busy ? l.submitting : l.submit}
      </button>
    </form>
  );
}
