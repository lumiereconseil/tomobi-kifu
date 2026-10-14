/** Operator details shown on the legal notice and contact lines. Env vars override the defaults. */
export const operator = {
  tradeName: "Lumière Conseil",
  name: process.env.OPERATOR_NAME?.trim() || "Yusuke Tachibana",
  email: process.env.CONTACT_EMAIL?.trim() || "masashida0912@gmail.com",
  phone: process.env.CONTACT_PHONE?.trim() || "070-9182-7701",
};

/** Applications are only accepted on the site when they can be stored durably. */
export function acceptsApplications(): boolean {
  return Boolean(process.env.DATABASE_URL) || process.env.NODE_ENV !== "production";
}
