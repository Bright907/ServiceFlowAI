/*
# Create contractors and leads tables for ServiceFlowAI

## Summary
Sets up the two core tables for the ServiceFlowAI multi-tenant SaaS app: one row
per signed-up contractor (their trade + pricing settings for their embeddable
quote widget), and one row per homeowner inquiry captured through that widget.

## 1. New Tables

### `contractors`
- `id` (uuid, primary key) - unique id for the contractor, also used in the
  public widget URL (e.g. /widget/{id}) and embed script.
- `user_id` (uuid, references auth.users, unique) - the signed-in account that
  owns this contractor profile. Defaults to the logged-in user automatically.
- `company_name` (text) - business name shown on the widget and dashboard.
- `trade` (text) - one of 'plumbing', 'hvac', 'roofing'. Determines which
  services and quantity labels the widget shows.
- `pricing` (jsonb) - the 3 configurable pricing variables: base_fee,
  rate_per_unit, emergency_multiplier.
- `created_at` (timestamptz) - when the contractor signed up.

### `leads`
- `id` (uuid, primary key)
- `contractor_id` (uuid, references contractors) - which contractor's widget
  captured this lead.
- `homeowner_name`, `email`, `phone`, `address` (text) - contact info the
  homeowner submitted.
- `service_type` (text) - the service they selected in the widget.
- `quantity` (numeric) - the quantity/size value they entered.
- `is_emergency` (boolean) - whether they flagged the job as urgent.
- `estimated_cost` (numeric) - the instant estimate the widget calculated.
- `status` (text) - lead pipeline stage: 'new', 'contacted', 'booked', 'closed'.
- `created_at` (timestamptz) - when the inquiry was submitted.

## 2. Security
- Row Level Security is enabled on both tables.
- `contractors` rows are intentionally readable by anyone (including
  anonymous visitors), because the embeddable widget must be able to load a
  contractor's trade and pricing without the homeowner being logged in.
  No sensitive account data (email, password) lives on this table - that
  stays in Supabase's protected `auth.users` table.
- Only the authenticated owner (matched via `user_id`) can insert, update, or
  delete their own contractor row.
- `leads` can be inserted by anyone (anon or authenticated), because the
  "Book Inspection" form is filled out by anonymous homeowners on the public
  widget.
- Only the authenticated contractor who owns the related `contractors` row
  can view, update (e.g. change status), or delete their own leads. Homeowners
  cannot read back lead data.
*/

CREATE TABLE IF NOT EXISTS contractors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  trade text NOT NULL CHECK (trade IN ('plumbing', 'hvac', 'roofing')),
  pricing jsonb NOT NULL DEFAULT '{"base_fee": 89, "rate_per_unit": 45, "emergency_multiplier": 1.5}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_contractors" ON contractors;
CREATE POLICY "public_select_contractors" ON contractors FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_contractor" ON contractors;
CREATE POLICY "insert_own_contractor" ON contractors FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_contractor" ON contractors;
CREATE POLICY "update_own_contractor" ON contractors FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_contractor" ON contractors;
CREATE POLICY "delete_own_contractor" ON contractors FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contractor_id uuid NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
  homeowner_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  service_type text NOT NULL,
  quantity numeric NOT NULL DEFAULT 1,
  is_emergency boolean NOT NULL DEFAULT false,
  estimated_cost numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'booked', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS leads_contractor_id_idx ON leads(contractor_id);

DROP POLICY IF EXISTS "select_own_leads" ON leads;
CREATE POLICY "select_own_leads" ON leads FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM contractors WHERE contractors.id = leads.contractor_id AND contractors.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "public_insert_leads" ON leads;
CREATE POLICY "public_insert_leads" ON leads FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_own_leads" ON leads;
CREATE POLICY "update_own_leads" ON leads FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM contractors WHERE contractors.id = leads.contractor_id AND contractors.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM contractors WHERE contractors.id = leads.contractor_id AND contractors.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "delete_own_leads" ON leads;
CREATE POLICY "delete_own_leads" ON leads FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM contractors WHERE contractors.id = leads.contractor_id AND contractors.user_id = auth.uid())
  );
