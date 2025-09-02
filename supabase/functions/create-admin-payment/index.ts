import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, institutionName, institutionNameKhmer } = await req.json();

    if (!email || !institutionName) {
      throw new Error("Email and institution name are required");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if a Stripe customer record exists for this email
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Create a one-time payment session for admin access
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: "Caso Schedule Pro - Admin License",
              description: `Administrative access for ${institutionName}`
            },
            unit_amount: 9900, // $99.00 for admin license
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/admin-setup?session_id={CHECKOUT_SESSION_ID}&email=${encodeURIComponent(email)}&institution=${encodeURIComponent(institutionName)}&institution_km=${encodeURIComponent(institutionNameKhmer || "")}`,
      cancel_url: `${req.headers.get("origin")}/auth?payment=cancelled`,
      metadata: {
        email,
        institutionName,
        institutionNameKhmer: institutionNameKhmer || "",
        type: "admin_license"
      }
    });

    console.log("Payment session created:", session.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating payment session:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});