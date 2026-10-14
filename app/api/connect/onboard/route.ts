import { NextResponse } from "next/server";
import { tokenMatches } from "@/lib/admin";
import { createOnboardingLink } from "@/lib/connect";
import { getStore } from "@/lib/db";
import { isLocale } from "@/lib/i18n";

/**
 * Operator-only: after vetting an application, create a Stripe Connect Express account for
 * the organisation and return an onboarding link to send them. The admin dashboard
 * (/admin) does the same with a button; this endpoint is for scripting.
 *
 * POST { applicationId: number, locale?: "ja" | "en" }
 * Header: x-admin-token: <ADMIN_TOKEN>
 */
export async function POST(req: Request) {
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken) return NextResponse.json({ error: "admin_token_not_configured" }, { status: 503 });
  if (!tokenMatches(req.headers.get("x-admin-token") ?? "", adminToken)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { applicationId?: unknown; locale?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const applicationId = Number(body?.applicationId);
  if (!Number.isInteger(applicationId) || applicationId <= 0) {
    return NextResponse.json({ error: "invalid_application_id" }, { status: 400 });
  }
  const app = await getStore().getApplication(applicationId);
  if (!app) return NextResponse.json({ error: "unknown_application" }, { status: 404 });
  if (app.status === "rejected") return NextResponse.json({ error: "application_rejected" }, { status: 409 });
  const locale = typeof body.locale === "string" && isLocale(body.locale) ? body.locale : "ja";

  try {
    await getStore().setApplicationStatus(app.id, "approved");
    return NextResponse.json(await createOnboardingLink(app, locale));
  } catch (err) {
    console.error("Stripe Connect onboarding failed", err);
    return NextResponse.json({ error: "stripe_error" }, { status: 502 });
  }
}
