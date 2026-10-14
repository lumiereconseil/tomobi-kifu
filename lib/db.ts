import postgres from "postgres";

export type Donation = {
  stripeId: string;
  recipientSlug: string;
  amount: number;
  currency: string;
  /** What the recipient receives, converted to yen. */
  amountJpy: number;
  /** Platform fee kept by Lumière Conseil, converted to yen. */
  feeJpy: number;
  monthly: boolean;
  anonymous: boolean;
  donorName: string | null;
  message: string | null;
  createdAt: Date;
};

export type Application = {
  orgName: string;
  category: string;
  country: string;
  contactName: string;
  email: string;
  website: string | null;
  description: string;
};

export type ApplicationStatus = "pending" | "approved" | "rejected";

export type StoredApplication = Application & {
  id: number;
  status: ApplicationStatus;
  stripeAccountId: string | null;
  createdAt: Date;
};

export type RecipientStats = { raisedJpy: number; supporters: number };

/** Gifts recorded since a given date, for the admin dashboard. */
export type PeriodSummary = {
  donationsJpy: number;
  feeJpy: number;
  count: number;
  monthlyCount: number;
  byRecipient: { slug: string; donationsJpy: number; count: number }[];
};

/**
 * Storage for donations and recipient applications. Uses Postgres when DATABASE_URL is
 * set (see db/schema.sql); otherwise falls back to an in-memory store that resets on
 * restart, which is enough for local development and demo mode.
 */
export interface Store {
  recordDonation(d: Omit<Donation, "createdAt">): Promise<void>;
  statsByRecipient(): Promise<Map<string, RecipientStats>>;
  recentDonations(slug: string, limit: number): Promise<Donation[]>;
  createApplication(a: Application): Promise<number>;
  setApplicationStripeAccount(id: number, accountId: string): Promise<void>;
  getApplication(id: number): Promise<StoredApplication | null>;
  listApplications(): Promise<StoredApplication[]>;
  setApplicationStatus(id: number, status: ApplicationStatus): Promise<void>;
  summarySince(since: Date): Promise<PeriodSummary>;
}

function summarize(
  rows: { recipientSlug: string; amountJpy: number; feeJpy: number; monthly: boolean }[],
): PeriodSummary {
  const by = new Map<string, { slug: string; donationsJpy: number; count: number }>();
  let donationsJpy = 0;
  let feeJpy = 0;
  let monthlyCount = 0;
  for (const r of rows) {
    // Gross gifts = what recipients receive plus the platform fee.
    donationsJpy += r.amountJpy + r.feeJpy;
    feeJpy += r.feeJpy;
    if (r.monthly) monthlyCount += 1;
    const e = by.get(r.recipientSlug) ?? { slug: r.recipientSlug, donationsJpy: 0, count: 0 };
    e.donationsJpy += r.amountJpy + r.feeJpy;
    e.count += 1;
    by.set(r.recipientSlug, e);
  }
  return {
    donationsJpy,
    feeJpy,
    count: rows.length,
    monthlyCount,
    byRecipient: [...by.values()].sort((a, b) => b.donationsJpy - a.donationsJpy),
  };
}

class MemoryStore implements Store {
  private donations: Donation[] = [];
  private applications: StoredApplication[] = [];

  async recordDonation(d: Omit<Donation, "createdAt">) {
    if (this.donations.some((x) => x.stripeId === d.stripeId)) return;
    this.donations.push({ ...d, createdAt: new Date() });
  }

  async statsByRecipient() {
    const map = new Map<string, RecipientStats>();
    for (const d of this.donations) {
      const s = map.get(d.recipientSlug) ?? { raisedJpy: 0, supporters: 0 };
      s.raisedJpy += d.amountJpy;
      s.supporters += 1;
      map.set(d.recipientSlug, s);
    }
    return map;
  }

  async recentDonations(slug: string, limit: number) {
    return this.donations
      .filter((d) => d.recipientSlug === slug)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createApplication(a: Application) {
    const id = this.applications.length + 1;
    this.applications.push({ ...a, id, status: "pending", stripeAccountId: null, createdAt: new Date() });
    return id;
  }

  async setApplicationStripeAccount(id: number, accountId: string) {
    const app = this.applications.find((a) => a.id === id);
    if (app) app.stripeAccountId = accountId;
  }

  async getApplication(id: number) {
    return this.applications.find((a) => a.id === id) ?? null;
  }

  async listApplications() {
    return [...this.applications].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async setApplicationStatus(id: number, status: ApplicationStatus) {
    const app = this.applications.find((a) => a.id === id);
    if (app) app.status = status;
  }

  async summarySince(since: Date) {
    return summarize(this.donations.filter((d) => d.createdAt >= since));
  }
}

type ApplicationRow = {
  id: string;
  org_name: string;
  category: string;
  country: string;
  contact_name: string;
  email: string;
  website: string | null;
  description: string;
  status: ApplicationStatus;
  stripe_account_id: string | null;
  created_at: Date;
};

function fromApplicationRow(r: ApplicationRow): StoredApplication {
  return {
    id: Number(r.id),
    orgName: r.org_name,
    category: r.category,
    country: r.country,
    contactName: r.contact_name,
    email: r.email,
    website: r.website,
    description: r.description,
    status: r.status,
    stripeAccountId: r.stripe_account_id,
    createdAt: r.created_at,
  };
}

class PostgresStore implements Store {
  constructor(private sql: postgres.Sql) {}

  async recordDonation(d: Omit<Donation, "createdAt">) {
    await this.sql`
      insert into donations (stripe_id, recipient_slug, amount, currency, amount_jpy, fee_jpy, monthly, anonymous, donor_name, message)
      values (${d.stripeId}, ${d.recipientSlug}, ${d.amount}, ${d.currency}, ${d.amountJpy}, ${d.feeJpy},
              ${d.monthly}, ${d.anonymous}, ${d.donorName}, ${d.message})
      on conflict (stripe_id) do nothing`;
  }

  async statsByRecipient() {
    const rows = await this.sql<{ recipient_slug: string; raised: string; supporters: string }[]>`
      select recipient_slug, sum(amount_jpy) as raised, count(*) as supporters
      from donations group by recipient_slug`;
    return new Map(
      rows.map((r) => [r.recipient_slug, { raisedJpy: Number(r.raised), supporters: Number(r.supporters) }]),
    );
  }

  async recentDonations(slug: string, limit: number) {
    const rows = await this.sql<
      {
        stripe_id: string;
        recipient_slug: string;
        amount: string;
        currency: string;
        amount_jpy: number;
        fee_jpy: number;
        monthly: boolean;
        anonymous: boolean;
        donor_name: string | null;
        message: string | null;
        created_at: Date;
      }[]
    >`select * from donations where recipient_slug = ${slug} order by created_at desc limit ${limit}`;
    return rows.map((r) => ({
      stripeId: r.stripe_id,
      recipientSlug: r.recipient_slug,
      amount: Number(r.amount),
      currency: r.currency,
      amountJpy: r.amount_jpy,
      feeJpy: Number(r.fee_jpy),
      monthly: r.monthly,
      anonymous: r.anonymous,
      donorName: r.donor_name,
      message: r.message,
      createdAt: r.created_at,
    }));
  }

  async createApplication(a: Application) {
    const [row] = await this.sql<{ id: string }[]>`
      insert into applications (org_name, category, country, contact_name, email, website, description)
      values (${a.orgName}, ${a.category}, ${a.country}, ${a.contactName}, ${a.email}, ${a.website}, ${a.description})
      returning id`;
    return Number(row.id);
  }

  async setApplicationStripeAccount(id: number, accountId: string) {
    await this.sql`update applications set stripe_account_id = ${accountId} where id = ${id}`;
  }

  async getApplication(id: number) {
    const [row] = await this.sql<ApplicationRow[]>`select * from applications where id = ${id}`;
    return row ? fromApplicationRow(row) : null;
  }

  async listApplications() {
    const rows = await this.sql<ApplicationRow[]>`select * from applications order by created_at desc limit 200`;
    return rows.map(fromApplicationRow);
  }

  async setApplicationStatus(id: number, status: ApplicationStatus) {
    await this.sql`update applications set status = ${status} where id = ${id}`;
  }

  async summarySince(since: Date) {
    const rows = await this.sql<{ recipient_slug: string; amount_jpy: number; fee_jpy: number; monthly: boolean }[]>`
      select recipient_slug, amount_jpy, fee_jpy, monthly from donations where created_at >= ${since}`;
    return summarize(
      rows.map((r) => ({
        recipientSlug: r.recipient_slug,
        amountJpy: Number(r.amount_jpy),
        feeJpy: Number(r.fee_jpy),
        monthly: r.monthly,
      })),
    );
  }
}

const globalStore = globalThis as unknown as { __donationStore?: Store };

export function getStore(): Store {
  if (!globalStore.__donationStore) {
    const url = process.env.DATABASE_URL;
    globalStore.__donationStore = url ? new PostgresStore(postgres(url, { max: 5 })) : new MemoryStore();
  }
  return globalStore.__donationStore;
}

/** Converts an amount to yen for totals. USD uses USD_JPY_RATE (default 150). */
export function toJpy(amount: number, currency: string): number {
  if (currency === "jpy") return Math.round(amount);
  const rate = Number(process.env.USD_JPY_RATE ?? 150);
  return Math.round(amount * rate);
}
