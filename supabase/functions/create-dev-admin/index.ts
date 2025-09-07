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

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingUser.users.find(user => user.email === email);

    if (userExists) {
      console.log(`User already exists: ${email}`);
      return new Response(JSON.stringify({
        success: true,
        email,
        password: "[Password securely generated]",
        user_id: userExists.id,
        institution: "Test Institution",
        message: "User already exists - you can login with the existing credentials"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: crypto.randomUUID().replace(/-/g, '').substring(0, 16),
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
      password: "[Password securely generated]",
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