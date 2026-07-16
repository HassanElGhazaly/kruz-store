/*
# Create products and orders tables for The Master Strategist Collection store

1. New Tables
- `products`
  - `id` (uuid, primary key)
  - `slug` (text, unique, not null) — URL-friendly identifier
  - `title` (text, not null) — product display name
  - `tagline` (text) — short marketing tagline
  - `description` (text) — full product description
  - `price` (numeric, not null) — price in USD
  - `compare_at_price` (numeric) — original/strikethrough price
  - `currency` (text, default 'USD')
  - `cover_image_url` (text) — book cover image URL
  - `spine_image_url` (text) — book spine image URL
  - `back_image_url` (text) — book back cover image URL
  - `features` (jsonb) — array of feature strings
  - `books` (jsonb) — array of {title, author, description} objects for included books
  - `file_path` (text) — path to the eBook file in the private storage bucket
  - `is_active` (boolean, default true)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

- `orders`
  - `id` (uuid, primary key)
  - `product_id` (uuid, foreign key to products)
  - `email` (text, not null) — customer email for delivery
  - `amount` (numeric, not null) — amount paid in USD
  - `currency` (text, default 'USD')
  - `status` (text, default 'pending') — pending | paid | failed | expired
  - `cryptomus_invoice_id` (text) — Cryptomus invoice identifier
  - `cryptomus_payment_url` (text) — Cryptomus hosted payment URL
  - `cryptomus_uuid` (text) — Cryptomus invoice UUID
  - `download_token` (text) — unique token used to generate signed download link
  - `download_url_expires_at` (timestamptz) — expiry of the signed download link
  - `paid_at` (timestamptz) — when payment was confirmed
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

2. Security
- Enable RLS on both tables.
- Products: public read (anon + authenticated) since product catalog is intentionally public.
  Only the service role (edge functions) can insert/update/delete products.
- Orders: anyone can create an order (checkout flow, no auth). Select/Update restricted
  to service role only — order data contains sensitive payment info and download links.
  The anon key can INSERT new orders (to start checkout) but cannot read or modify them;
  all fulfillment is handled server-side via edge functions with the service role key.

3. Indexes
- Index on orders.download_token for fast webhook lookups.
- Index on orders.cryptomos_uuid for webhook verification.
- Index on products.slug for fast lookups.
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  tagline text,
  description text,
  price numeric(10,2) NOT NULL,
  compare_at_price numeric(10,2),
  currency text NOT NULL DEFAULT 'USD',
  cover_image_url text,
  spine_image_url text,
  back_image_url text,
  features jsonb DEFAULT '[]'::jsonb,
  books jsonb DEFAULT '[]'::jsonb,
  file_path text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE RESTRICT,
  email text NOT NULL,
  amount numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'pending',
  cryptomos_invoice_id text,
  cryptomos_payment_url text,
  cryptomos_uuid text,
  download_token text UNIQUE,
  download_url_expires_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Products: public read (catalog is intentionally public)
DROP POLICY IF EXISTS "anon_read_products" ON products;
CREATE POLICY "anon_read_products"
ON products FOR SELECT
TO anon, authenticated USING (true);

-- Orders: anon can INSERT (to start checkout), but cannot read/update/delete
-- Fulfillment is server-side only (service role in edge functions)
DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders"
ON orders FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_download_token ON orders(download_token);
CREATE INDEX IF NOT EXISTS idx_orders_cryptomos_uuid ON orders(cryptomos_uuid);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- Storage bucket for eBook files (private — access via signed URLs only)
INSERT INTO storage.buckets (id, name, public)
VALUES ('ebooks', 'ebooks', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: service role has full access (bypasses RLS).
-- Anon/authenticated get NO direct access — all access is via edge functions
-- generating signed URLs with the service role key.
