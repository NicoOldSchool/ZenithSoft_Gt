'use client'

import { useRouter } from 'next/navigation'
import { LogOut, Menu } from 'lucide-react'
import { User } from '@/types/database'
import { useSupabase } from '@/lib/supabase-context'

interface DashboardHeaderProps {
  user: User
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()
  const { supabase } = useSupabase()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1" />
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <div className="flex items-center gap-x-4">
            <div className="text-sm">
              <p className="font-medium text-gray-900">{user.nombre}</p>
              <p className="text-gray-500">{user.rol}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-x-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
