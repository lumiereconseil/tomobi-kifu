import Script from "next/script";

/** Metricool's free web tracker: counts visits, pages, sources and countries for the Lumière Conseil brand. */
const METRICOOL_HASH = process.env.NEXT_PUBLIC_METRICOOL_HASH?.trim() || "aa1fa57f0832a6f2254c54ec082c2747";

export function Analytics() {
  if (process.env.NODE_ENV !== "production" || !METRICOOL_HASH) return null;
  return (
    <Script id="metricool-tracker" strategy="afterInteractive">
      {`(function(){var s=document.createElement("script");s.src="https://tracker.metricool.com/resources/be.js";s.async=true;s.onload=function(){window.beTracker&&window.beTracker.t({hash:${JSON.stringify(METRICOOL_HASH)}})};document.head.appendChild(s)})();`}
    </Script>
  );
}
