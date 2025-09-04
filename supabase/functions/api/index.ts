import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { pathname } = new URL(req.url)
    const path = pathname.replace('/api/', '')

    // Route handling
    switch (path) {
      case 'establecimientos':
        return await handleEstablecimientos(req, supabaseClient)
      case 'pacientes':
        return await handlePacientes(req, supabaseClient)
      case 'profesionales':
        return await handleProfesionales(req, supabaseClient)
      case 'turnos':
        return await handleTurnos(req, supabaseClient)
      case 'aranceles':
        return await handleAranceles(req, supabaseClient)
      case 'practicas':
        return await handlePracticas(req, supabaseClient)
      default:
        return new Response(
          JSON.stringify({ error: 'Endpoint not found' }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

// Handler functions
async function handleEstablecimientos(req: Request, supabase: any) {
  const { data, error } = await supabase
    .from('establecimientos')
    .select('*')
  
  if (error) throw error
  
  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handlePacientes(req: Request, supabase: any) {
  const { data, error } = await supabase
    .from('pacientes')
    .select('*')
  
  if (error) throw error
  
  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleProfesionales(req: Request, supabase: any) {
  const { data, error } = await supabase
    .from('profesionales')
    .select('*')
  
  if (error) throw error
  
  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleTurnos(req: Request, supabase: any) {
  const { data, error } = await supabase
    .from('turnos')
    .select('*')
  
  if (error) throw error
  
  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleAranceles(req: Request, supabase: any) {
  const { data, error } = await supabase
    .from('aranceles')
    .select('*')
  
  if (error) throw error
  
  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handlePracticas(req: Request, supabase: any) {
  const { data, error } = await supabase
    .from('practicas')
    .select('*')
  
  if (error) throw error
  
  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
