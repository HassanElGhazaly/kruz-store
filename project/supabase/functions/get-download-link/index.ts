import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { token } = await req.json();

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Missing download token" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Find the order by download token
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("download_token", token)
      .maybeSingle();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: "Invalid download token" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (order.status !== "paid") {
      return new Response(
        JSON.stringify({ error: "Payment not confirmed" }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch product to get file path
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("file_path, title")
      .eq("id", order.product_id)
      .maybeSingle();

    if (productError || !product || !product.file_path) {
      return new Response(
        JSON.stringify({ error: "Product file not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate signed URL (24-hour expiry)
    const { data: signedUrlData, error: signedUrlError } = await supabase
      .storage
      .from("ebooks")
      .createSignedUrl(product.file_path, 86400);

    if (signedUrlError || !signedUrlData?.signedUrl) {
      return new Response(
        JSON.stringify({ error: "Failed to generate download link" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update order with expiry time
    await supabase
      .from("orders")
      .update({ download_url_expires_at: new Date(Date.now() + 86400 * 1000).toISOString() })
      .eq("id", order.id);

    return new Response(
      JSON.stringify({
        url: signedUrlData.signedUrl,
        expires_in: "24 hours",
        product_title: product.title,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
