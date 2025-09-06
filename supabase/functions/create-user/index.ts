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
    const { 
      email, 
      password, 
      first_name, 
      last_name, 
      first_name_khmer, 
      last_name_khmer, 
      role, 
      institution_id 
    } = await req.json();
    
    if (!email || !password || !first_name || !last_name || !role || !institution_id) {
      throw new Error("Missing required fields");
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
      password,
      email_confirm: true,
      user_metadata: {
        first_name,
        last_name,
        first_name_khmer,
        last_name_khmer,
        institution_id,
        role
      }
    });

    if (authError) {
      throw authError;
    }

    console.log(`Created user account: ${email}`);
    console.log(`User ID: ${authData.user.id}`);

    return new Response(JSON.stringify({
      success: true,
      email,
      user_id: authData.user.id
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error creating user:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to create user"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});