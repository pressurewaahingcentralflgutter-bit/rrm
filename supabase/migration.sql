-- RRM Booking System — Supabase Schema
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/jtbyonvsmfeqaaogszsi/sql/new

-- ─── Bookings table ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id                       TEXT        PRIMARY KEY,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status                   TEXT        NOT NULL DEFAULT 'pending_quote',
  services                 TEXT[]      NOT NULL DEFAULT '{}',
  property_type            TEXT,
  bedroom_count            INTEGER,
  scheduled_date           TEXT,
  scheduled_time           TEXT,
  estimated_duration_hours NUMERIC,
  estimated_price          NUMERIC,
  confirmed_price          NUMERIC,
  customer_name            TEXT        NOT NULL,
  customer_phone           TEXT        NOT NULL,
  customer_email           TEXT        NOT NULL,
  customer_postal_code     TEXT        NOT NULL,
  customer_address         TEXT,
  customer_notes           TEXT
);

-- ─── Admin settings table (password override etc.) ───────────────────────────
CREATE TABLE IF NOT EXISTS admin_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- ─── Row Level Security (only service-role key can access) ───────────────────
ALTER TABLE bookings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- No public policies — the service role key bypasses RLS entirely.
-- Never expose the service role key on the client side.
