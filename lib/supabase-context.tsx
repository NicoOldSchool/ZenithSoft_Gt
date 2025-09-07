'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing env vars: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

interface SupabaseContextType {
  supabase: SupabaseClient
  initialized: boolean
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

// Singleton global para evitar múltiples instancias
let globalSupabaseInstance: SupabaseClient | null = null

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  // Crear la instancia directamente sin estado
  if (!globalSupabaseInstance) {
    globalSupabaseInstance = createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      }
    })
  }

  return (
    <SupabaseContext.Provider value={{ supabase: globalSupabaseInstance, initialized: true }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}
// Función para obtener la instancia directamente (para casos especiales)
export function getSupabaseClient(): SupabaseClient {
  if (!globalSupabaseInstance) {
    globalSupabaseInstance = createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      }
    })
  }
  return globalSupabaseInstance
}

