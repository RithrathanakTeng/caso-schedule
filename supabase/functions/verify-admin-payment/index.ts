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
    const { sessionId } = await req.json();

    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Initialize Supabase with service role key
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      throw new Error("Payment not completed");
    }

    const { email, institutionName, institutionNameKhmer } = session.metadata!;

    // Create the institution
    const { data: institutionData, error: institutionError } = await supabase
      .from('institutions')
      .insert({
        name: institutionName,
        name_khmer: institutionNameKhmer,
        email: email,
        is_active: true
      })
      .select()
      .single();

    if (institutionError) {
      console.error("Error creating institution:", institutionError);
      throw new Error("Failed to create institution");
    }

    console.log("Institution created:", institutionData.id);

    // Generate a secure password for the admin user
    const tempPassword = crypto.randomUUID().substring(0, 12);

    // Create the admin user account
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        institution_id: institutionData.id,
        first_name: "Admin",
        last_name: "User",
        role: "admin"
      }
    });

    if (userError) {
      console.error("Error creating user:", userError);
      throw new Error("Failed to create admin user");
    }

    console.log("Admin user created:", userData.user.id);

    return new Response(JSON.stringify({ 
      success: true, 
      institutionId: institutionData.id,
      userId: userData.user.id,
      tempPassword: tempPassword,
      message: "Admin account created successfully"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error verifying payment:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});