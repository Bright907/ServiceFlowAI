/*
Supabase schema migration (run this in your Supabase SQL editor)
*/

CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY,
  business_name TEXT,
  email TEXT,
  trade TEXT,
  pricing JSONB,
  subscription JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT,
  unit_name TEXT,
  default_units INTEGER
);

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  service TEXT,
  units NUMERIC,
  estimate NUMERIC,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
