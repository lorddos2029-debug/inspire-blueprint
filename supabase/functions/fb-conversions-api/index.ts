import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PIXEL_ID = "1849843465686098";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ACCESS_TOKEN = Deno.env.get("FB_CAPI_ACCESS_TOKEN");
    if (!ACCESS_TOKEN) {
      throw new Error("FB_CAPI_ACCESS_TOKEN not configured");
    }

    const body = await req.json();
    const { eventName, eventTime, userData, customData, eventSourceUrl, actionSource, orderId, transactionId } = body;

    // SAFETY GUARD: Never send a Purchase event unless the corresponding order
    // is actually marked as paid in the database. Prevents PIX-generated (but
    // unpaid) orders from being counted as conversions on Facebook.
    if (eventName === "Purchase") {
      const ref = String(orderId || transactionId || "").trim();
      if (!ref) {
        console.warn("[fb-capi] Purchase blocked: no orderId/transactionId provided");
        return new Response(JSON.stringify({ blocked: true, reason: "missing_order_reference" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      try {
        const supa = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
        );
        const { data: ord } = await supa
          .from("orders")
          .select("payment_status")
          .or(`id.eq.${ref},transaction_id.eq.${ref},ticket.eq.${ref}`)
          .maybeSingle();
        if (!ord || ord.payment_status !== "paid") {
          console.warn(`[fb-capi] Purchase blocked: order ${ref} status=${ord?.payment_status ?? "not_found"}`);
          return new Response(JSON.stringify({ blocked: true, reason: "order_not_paid", status: ord?.payment_status ?? null }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      } catch (guardErr: any) {
        console.error("[fb-capi] Purchase guard failed:", guardErr.message);
        return new Response(JSON.stringify({ blocked: true, reason: "guard_error" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Build user_data with all available parameters for maximum match quality
    const user_data: Record<string, any> = {};

    // Email (hashed)
    if (userData?.email) {
      user_data.em = [await hashSHA256(userData.email.toLowerCase().trim())];
    }

    // Phone (hashed, digits only)
    if (userData?.phone) {
      const phoneDigits = userData.phone.replace(/\D/g, "");
      // Ensure Brazilian phone has country code
      const normalizedPhone = phoneDigits.startsWith("55") ? phoneDigits : `55${phoneDigits}`;
      user_data.ph = [await hashSHA256(normalizedPhone)];
    }

    // First name (hashed)
    if (userData?.firstName) {
      user_data.fn = [await hashSHA256(userData.firstName.toLowerCase().trim())];
    }

    // Last name (hashed)
    if (userData?.lastName) {
      user_data.ln = [await hashSHA256(userData.lastName.toLowerCase().trim())];
    }

    // External ID / CPF (hashed) - used as unique customer identifier
    if (userData?.externalId) {
      user_data.external_id = [await hashSHA256(userData.externalId.trim())];
    }

    // Zip/postal code (hashed)
    if (userData?.zipCode) {
      user_data.zp = [await hashSHA256(userData.zipCode.trim())];
    }

    // City (hashed, lowercase, no special chars)
    if (userData?.city) {
      user_data.ct = [await hashSHA256(
        userData.city.toLowerCase().trim()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      )];
    }

    // State (hashed, lowercase 2-letter code)
    if (userData?.state) {
      user_data.st = [await hashSHA256(userData.state.toLowerCase().trim())];
    }

    // Country (hashed)
    if (userData?.country) {
      user_data.country = [await hashSHA256(userData.country.toLowerCase().trim())];
    }

    // Client IP address (from request headers - NOT hashed per FB docs)
    const forwardedFor = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "";
    const clientIp = forwardedFor.split(",")[0].trim();
    if (clientIp) {
      user_data.client_ip_address = clientIp;
    }

    // Client user agent (NOT hashed per FB docs)
    // Prefer the one sent from the browser (more accurate), fall back to request header
    const clientUA = userData?.clientUserAgent || req.headers.get("user-agent") || "";
    if (clientUA) {
      user_data.client_user_agent = clientUA;
    }

    // Facebook click ID (NOT hashed)
    if (userData?.fbc) {
      user_data.fbc = userData.fbc;
    }

    // Facebook browser ID (NOT hashed)
    if (userData?.fbp) {
      user_data.fbp = userData.fbp;
    }

    // Date of birth - if available (hashed)
    if (userData?.dateOfBirth) {
      user_data.db = [await hashSHA256(userData.dateOfBirth.trim())];
    }

    // Gender - if available (hashed)
    if (userData?.gender) {
      user_data.ge = [await hashSHA256(userData.gender.toLowerCase().trim())];
    }

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: eventTime || Math.floor(Date.now() / 1000),
          action_source: actionSource || "website",
          event_source_url: eventSourceUrl || "",
          event_id: crypto.randomUUID(),
          user_data,
          custom_data: customData || {},
        },
      ],
    };

    console.log("Sending to FB CAPI:", JSON.stringify(payload));

    const response = await fetch(
      `https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const responseText = await response.text();
    console.log("FB CAPI response:", response.status, responseText);

    if (!response.ok) {
      throw new Error(`FB CAPI error [${response.status}]: ${responseText}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("FB CAPI error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function hashSHA256(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
