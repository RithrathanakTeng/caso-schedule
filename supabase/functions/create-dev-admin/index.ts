import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    
    if (!email) {
      throw new Error("Email is required");
    }

    // Use service role to create auth user and profiles
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: "dev123456",
      email_confirm: true,
      user_metadata: {
        first_name: "Developer",
        last_name: "Admin",
        institution_id: "00000000-0000-0000-0000-000000000001",
        role: "admin"
      }
    });

    if (authError) {
      throw authError;
    }

    console.log(`Created developer admin account: ${email}`);
    console.log(`User ID: ${authData.user.id}`);

    return new Response(JSON.stringify({
      success: true,
      email,
      password: "dev123456",
      user_id: authData.user.id,
      institution: "Test Institution"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error creating dev admin:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to create developer admin"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});