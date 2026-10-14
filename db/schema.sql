-- Run once against your Postgres database (Neon, Supabase, Vercel Postgres, etc.).
create table if not exists donations (
  id              bigserial primary key,
  stripe_id       text unique not null,      -- checkout session or invoice id
  recipient_slug  text not null,
  amount          numeric(12, 2) not null,   -- in the currency's main unit (yen, dollars)
  currency        text not null,
  amount_jpy      integer not null,          -- what the recipient receives, in yen
  fee_jpy         integer not null default 0, -- platform fee kept by Lumiere Conseil, in yen
  monthly         boolean not null default false,
  anonymous       boolean not null default false,
  donor_name      text,
  message         text,
  created_at      timestamptz not null default now()
);
create index if not exists donations_recipient_idx on donations (recipient_slug, created_at desc);

create table if not exists applications (
  id                 bigserial primary key,
  org_name           text not null,
  category           text not null,
  country            text not null,
  contact_name       text not null,
  email              text not null,
  website            text,
  description        text not null,
  status             text not null default 'pending',  -- pending | approved | rejected
  stripe_account_id  text,
  created_at         timestamptz not null default now()
);
