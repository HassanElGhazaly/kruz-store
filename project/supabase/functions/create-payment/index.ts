import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Cryptomus sign: MD5(base64(json_body) + api_key)
async function generateSign(body: object, apiKey: string): Promise<string> {
  const jsonBody = JSON.stringify(body);
  const base64Body = btoa(jsonBody);
  const data = new TextEncoder().encode(base64Body + apiKey);
  const hashBuffer = await crypto.subtle.digest("MD5" as any, data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { product_slug, email } = await req.json();

    if (!product_slug || !email) {
      return new Response(
        JSON.stringify({ error: "Missing product_slug or email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch product
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("slug", product_slug)
      .eq("is_active", true)
      .maybeSingle();

    if (productError || !product) {
      return new Response(
        JSON.stringify({ error: "Product not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate a unique download token
    const downloadToken = crypto.randomUUID();

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        product_id: product.id,
        email: email,
        amount: product.price,
        currency: product.currency,
        status: "pending",
        download_token: downloadToken,
      })
      .select()
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: "Failed to create order" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Read Cryptomus credentials from environment variables
    const merchantUuid = process.env.CRYPTOMUS_UUID;
    const apiKey = process.env.CRYPTOMUS_API_KEY;

    if (!merchantUuid || !apiKey) {
      return new Response(
        JSON.stringify({
          order_id: order.id,
          download_token: downloadToken,
          amount: product.price,
          currency: product.currency,
          payment_url: null,
          message: "Cryptomus not configured. Set CRYPTOMUS_UUID and CRYPTOMUS_API_KEY environment variables.",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const origin = req.headers.get("origin") || "";
    const webhookUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/cryptomus-webhook`;

    const invoiceBody = {
      amount: String(product.price),
      currency: product.currency,
      order_id: order.id,
      url_return: `${origin}/checkout?order=${order.id}`,
      url_success: `${origin}/success?order=${order.id}&token=${downloadToken}`,
      url_callback: webhookUrl,
      is_payment_multiple: false,
      lifetime: 3600,
    };

    const sign = await generateSign(invoiceBody, apiKey);

    const cryptomusResponse = await fetch("https://api.cryptomus.com/v1/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "merchant": merchantUuid,
        "sign": sign,
      },
      body: JSON.stringify(invoiceBody),
    });

    const cryptomusData = await cryptomusResponse.json();

    if (!cryptomusResponse.ok) {
      await supabase.from("orders").update({ status: "failed" }).eq("id", order.id);
      return new Response(
        JSON.stringify({ error: "Failed to create payment invoice", details: cryptomusData }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update order with Cryptomus invoice details
    await supabase
      .from("orders")
      .update({
        cryptomos_invoice_id: cryptomusData.result?.uuid || null,
        cryptomos_payment_url: cryptomusData.result?.url || null,
        cryptomos_uuid: cryptomusData.result?.uuid || null,
      })
      .eq("id", order.id);

    return new Response(
      JSON.stringify({
        order_id: order.id,
        download_token: downloadToken,
        payment_url: cryptomusData.result?.url || null,
        amount: product.price,
        currency: product.currency,
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
