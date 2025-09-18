import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { userId, institutionId } = await req.json()

    if (!userId || !institutionId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`Deleting user: ${userId} from institution: ${institutionId}`)

    // Delete related data first
    console.log('Deleting notifications...')
    await supabaseClient
      .from('notifications')
      .delete()
      .eq('user_id', userId)

    console.log('Deleting teacher availability...')
    await supabaseClient
      .from('teacher_availability')
      .delete()
      .eq('teacher_id', userId)

    console.log('Deleting teacher subject assignments...')
    await supabaseClient
      .from('teacher_subject_assignments')
      .delete()
      .eq('teacher_id', userId)

    console.log('Deleting user roles...')
    const { error: rolesError } = await supabaseClient
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('institution_id', institutionId)

    if (rolesError) {
      console.error('Error deleting roles:', rolesError)
      throw rolesError
    }

    console.log('Deleting profile...')
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .delete()
      .eq('user_id', userId)
      .eq('institution_id', institutionId)

    if (profileError) {
      console.error('Error deleting profile:', profileError)
      throw profileError
    }

    console.log('Deleting auth user...')
    const { error: authError } = await supabaseClient.auth.admin.deleteUser(userId)

    if (authError) {
      console.error('Error deleting auth user:', authError)
      throw authError
    }

    console.log('User deleted successfully')

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in delete-user function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})