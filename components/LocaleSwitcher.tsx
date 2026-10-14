"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? `/${locale}`;
  const other: Locale = locale === "ja" ? "en" : "ja";
  const href = pathname.replace(/^\/(ja|en)(?=\/|$)/, `/${other}`);
  return (
    <Link href={href} className="locale-switch" hrefLang={other}>
      {other === "en" ? "English" : "日本語"}
    </Link>
  );
}
