import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Cryptomus webhook sign verification:
// MD5(base64(json_body_without_sign) + api_key)
// Slashes in the JSON must be escaped (Cryptomus sends them escaped)
async function verifySign(body: Record<string, unknown>, receivedSign: string, apiKey: string): Promise<boolean> {
  const { sign: _sign, ...payload } = body;
  // Cryptomus escapes forward slashes in JSON — match their encoding
  const jsonBody = JSON.stringify(payload).replace(/\//g, "\\/");
  const base64Body = btoa(jsonBody);
  const data = new TextEncoder().encode(base64Body + apiKey);
  const hashBuffer = await crypto.subtle.digest("MD5" as any, data);
  const expectedSign = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return expectedSign === receivedSign;
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

    const rawBody = await req.text();
    const body = JSON.parse(rawBody);

    const apiKey = process.env.CRYPTOMUS_API_KEY;

    // Verify webhook signature
    if (apiKey && body?.sign) {
      const isValid = await verifySign(body, body.sign, apiKey);
      if (!isValid) {
        return new Response(
          JSON.stringify({ error: "Invalid signature" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const cryptomusUuid = body?.uuid || body?.result?.uuid;
    const orderId = body?.order_id || body?.result?.order_id;
    const status = body?.status || body?.result?.status;
    const isFinal = body?.is_final ?? body?.result?.is_final ?? false;

    // Cryptomus payment statuses: confirm_check, paid, paid_over, fail, wrong_amount, cancel, system_fail
    if (!cryptomusUuid && !orderId) {
      return new Response(
        JSON.stringify({ error: "Missing order identifier" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Find the order
    let query = supabase.from("orders").select("*");
    if (orderId) {
      query = query.eq("id", orderId);
    } else if (cryptomusUuid) {
      query = query.eq("cryptomos_uuid", cryptomusUuid);
    }

    const { data: order, error: orderError } = await query.maybeSingle();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Handle payment status
    if ((status === "paid" || status === "paid_over") && isFinal) {
      // Fetch product to get file path
      const { data: productData } = await supabase
        .from("products")
        .select("file_path")
        .eq("id", order.product_id)
        .maybeSingle();

      const filePath = productData?.file_path || null;
      let expiresAt: string | null = null;

      if (filePath) {
        const { data: signedUrlData, error: signedUrlError } = await supabase
          .storage
          .from("ebooks")
          .createSignedUrl(filePath, 86400); // 24-hour expiry

        if (!signedUrlError && signedUrlData?.signedUrl) {
          expiresAt = new Date(Date.now() + 86400 * 1000).toISOString();
        }
      }

      // Update order to paid
      await supabase
        .from("orders")
        .update({
          status: "paid",
          paid_at: new Date().toISOString(),
          download_url_expires_at: expiresAt,
        })
        .eq("id", order.id);
    } else if (status === "fail" || status === "cancel" || status === "system_fail" || status === "wrong_amount") {
      await supabase
        .from("orders")
        .update({ status: "failed" })
        .eq("id", order.id);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
