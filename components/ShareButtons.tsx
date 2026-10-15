"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";

/** Share links for X, Facebook, LINE, Bluesky and email, plus copy-link and the phone's own share sheet. */
export function ShareButtons({ url, text, locale, hashtags = [] }: { url: string; text: string; locale: Locale; hashtags?: string[] }) {
  const ja = locale === "ja";
  const [copied, setCopied] = useState(false);
  // Set after mount so the server and first client render match.
  const [canShare, setCanShare] = useState(false);
  useEffect(() => setCanShare("share" in navigator), []);
  const tags = hashtags.map((h) => `#${h}`).join(" ");
  const full = `${text}${tags ? ` ${tags}` : ""}`;
  const u = encodeURIComponent(url);
  const links = [
    { name: "X", href: `https://x.com/intent/post?text=${encodeURIComponent(full)}&url=${u}` },
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { name: "LINE", href: `https://social-plugins.line.me/lineit/share?url=${u}&text=${encodeURIComponent(text)}` },
    { name: "Bluesky", href: `https://bsky.app/intent/compose?text=${encodeURIComponent(`${full} ${url}`)}` },
    { name: ja ? "メール" : "Email", href: `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(`${text}\n${url}`)}` },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt(ja ? "このURLをコピーしてください" : "Copy this link", url);
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title: text, text, url });
    } catch {
      // The viewer closed the share sheet.
    }
  }

  return (
    <div className="share" aria-label={ja ? "このページをシェア" : "Share this page"}>
      <span className="share-label">{ja ? "このページを広める" : "Spread the word"}</span>
      <div className="share-buttons">
        {links.map((l) => (
          <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer" className={`share-btn share-${l.name.toLowerCase()}`}>
            {l.name}
          </a>
        ))}
        <button type="button" className="share-btn" onClick={copy}>
          {copied ? (ja ? "コピーしました" : "Copied") : ja ? "リンクをコピー" : "Copy link"}
        </button>
        {canShare && (
          <button type="button" className="share-btn" onClick={nativeShare}>
            {ja ? "その他" : "More"}
          </button>
        )}
      </div>
    </div>
  );
}
