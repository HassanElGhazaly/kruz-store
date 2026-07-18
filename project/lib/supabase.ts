import { getSupabase } from '@/lib/supabase';
const supabase = getSupabase();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const getSupabase = () => createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  currency: string;
  cover_image_url: string | null;
  spine_image_url: string | null;
  back_image_url: string | null;
  features: string[];
  books: { title: string; author: string; description: string }[];
  file_path: string | null;
  is_active: boolean;
};

export type Order = {
  id: string;
  product_id: string;
  email: string;
  amount: number;
  currency: string;
  status: string;
  cryptomos_invoice_id: string | null;
  cryptomos_payment_url: string | null;
  cryptomos_uuid: string | null;
  download_token: string | null;
  download_url_expires_at: string | null;
  paid_at: string | null;
  created_at: string;
};

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) return null;
  return data as Product;
}

export async function fetchAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data as Product[];
}
