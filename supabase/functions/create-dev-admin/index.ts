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
    const { email, institutionId } = await req.json();
    
    if (!email) {
      throw new Error("Email is required");
    }

    if (!institutionId) {
      throw new Error("Institution ID is required");
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

    // Get institution details
    const { data: institution, error: instError } = await supabaseAdmin
      .from('institutions')
      .select('name')
      .eq('id', institutionId)
      .single();

    if (instError || !institution) {
      throw new Error("Institution not found");
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingUser.users.find(user => user.email === email);

    if (userExists) {
      console.log(`User already exists: ${email}`);
      return new Response(JSON.stringify({
        success: true,
        email,
        password: "dev123456",
        user_id: userExists.id,
        institution: institution.name,
        message: "User already exists - you can login with the existing credentials"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Generate a consistent password for dev purposes
    const password = "dev123456";

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: "Developer",
        last_name: "Admin",
        institution_id: institutionId,
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
      password,
      user_id: authData.user.id,
      institution: institution.name
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