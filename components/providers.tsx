'use client'

import { SupabaseProvider } from '@/lib/supabase-context'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseProvider>
      {children}
    </SupabaseProvider>
  )
}
