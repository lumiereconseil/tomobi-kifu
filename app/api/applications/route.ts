import { NextResponse } from "next/server";
import { getStore, type Application } from "@/lib/db";

const categories = ["municipality", "welfare", "disaster"] as const;

const maxLen = {
  orgName: 200,
  country: 100,
  contactName: 100,
  email: 254,
  website: 500,
  description: 4000,
} as const;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = Partial<Record<keyof typeof maxLen | "category" | "company", unknown>>;

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: the "company" field is hidden from people. Bots that fill it get a fake success.
  if (str(body.company)) return NextResponse.json({ id: 0 });

  const values = {
    orgName: str(body.orgName),
    country: str(body.country),
    contactName: str(body.contactName),
    email: str(body.email),
    website: str(body.website),
    description: str(body.description),
  };
  const category = str(body.category);

  const errors: string[] = [];
  for (const key of ["orgName", "country", "contactName", "email", "description"] as const) {
    if (!values[key]) errors.push(`${key}_required`);
  }
  for (const key of Object.keys(maxLen) as (keyof typeof maxLen)[]) {
    if (values[key].length > maxLen[key]) errors.push(`${key}_too_long`);
  }
  if (!(categories as readonly string[]).includes(category)) errors.push("category_invalid");
  if (values.email && !emailPattern.test(values.email)) errors.push("email_invalid");
  if (values.website && !/^https?:\/\/\S+$/i.test(values.website)) errors.push("website_invalid");

  if (errors.length) return NextResponse.json({ error: "invalid_input", fields: errors }, { status: 400 });

  const application: Application = {
    ...values,
    category,
    website: values.website || null,
  };

  try {
    const id = await getStore().createApplication(application);
    return NextResponse.json({ id });
  } catch (err) {
    console.error("createApplication failed", err);
    return NextResponse.json({ error: "storage_error" }, { status: 500 });
  }
}
