import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "管理画面 | ともに寄付",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <main className="container section admin">{children}</main>
      </body>
    </html>
  );
}
