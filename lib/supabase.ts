import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing env vars: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// Singleton global más robusto - solo para casos especiales fuera del contexto
let supabaseInstance: SupabaseClient | null = null
let supabaseAdminInstance: SupabaseClient | null = null

// Función para obtener la instancia de Supabase (solo para casos especiales fuera del contexto)
export function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      }
    })
  }
  return supabaseInstance
}

// Función para obtener la instancia de Supabase Admin
export function getSupabaseAdminClient(): SupabaseClient {
  if (typeof window !== 'undefined') {
    throw new Error('supabaseAdmin solo puede usarse en el servidor')
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    throw new Error('Missing env var: SUPABASE_SERVICE_ROLE_KEY')
  }

  if (!supabaseAdminInstance) {
    supabaseAdminInstance = createClient(supabaseUrl!, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  }
  return supabaseAdminInstance
}

// Exportar las instancias (solo para compatibilidad hacia atrás)
// NOTA: En componentes React, usa useSupabase() del contexto en su lugar
export const supabase = getSupabaseClient()
// Export diferido de admin: no inicializar en el cliente
export const supabaseAdmin: SupabaseClient = (typeof window === 'undefined')
  ? getSupabaseAdminClient()
  : (null as unknown as SupabaseClient)