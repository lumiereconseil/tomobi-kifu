import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, tokenMatches } from "@/lib/admin";

async function login(formData: FormData) {
  "use server";
  const expected = process.env.ADMIN_TOKEN;
  const given = String(formData.get("token") ?? "");
  if (!expected || !tokenMatches(given, expected)) redirect("/admin/login?error=1");
  (await cookies()).set(ADMIN_COOKIE, given, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: 60 * 60 * 12,
  });
  redirect("/admin");
}

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const configured = Boolean(process.env.ADMIN_TOKEN);
  return (
    <div className="admin-login">
      <h1>管理画面ログイン</h1>
      {!configured && <p className="notice">環境変数 ADMIN_TOKEN が設定されていないため、ログインできません。</p>}
      {error && <p className="error">トークンが正しくありません。</p>}
      <form action={login} className="donate-form">
        <label className="field">
          <span>管理者トークン</span>
          <input type="password" name="token" required autoComplete="current-password" />
        </label>
        <button type="submit" className="btn btn-primary">ログイン</button>
      </form>
    </div>
  );
}
