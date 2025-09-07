'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Session } from '@supabase/supabase-js'
import { User as AppUser } from '@/types/database'
import { useSupabase } from '@/lib/supabase-context'

export function useAuth() {
  const { supabase } = useSupabase()
  const [user, setUser] = useState<User | null>(null)
  const [appUser, setAppUser] = useState<AppUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    // Obtener sesión inicial
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!mounted) return
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Obtener datos del usuario desde nuestra tabla
          const { data: appUserData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          if (mounted) {
            setAppUser(appUserData)
          }
        }
        
        if (mounted) {
          setLoading(false)
        }
      } catch (error) {
        console.error('Error getting session:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getSession()

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          try {
            // Obtener datos del usuario desde nuestra tabla
            const { data: appUserData } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single()
            
            if (mounted) {
              setAppUser(appUserData)
            }
          } catch (error) {
            console.error('Error getting user data:', error)
          }
        } else {
          if (mounted) {
            setAppUser(null)
          }
        }
        
        if (mounted) {
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signUp = async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setUser(null)
      setAppUser(null)
      setSession(null)
      router.push('/login')
    }
    return { error }
  }

  return {
    user,
    appUser,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  }
}
