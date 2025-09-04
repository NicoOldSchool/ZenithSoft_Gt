'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Calendar,
  Users,
  UserCheck,
  DollarSign,
  Activity,
  Home,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Turnos', href: '/dashboard/turnos', icon: Calendar },
  { name: 'Pacientes', href: '/dashboard/pacientes', icon: Users },
  { name: 'Profesionales', href: '/dashboard/profesionales', icon: UserCheck },
  { name: 'Aranceles', href: '/dashboard/aranceles', icon: DollarSign },
  { name: 'Prácticas', href: '/dashboard/practicas', icon: Activity },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <>
      {/* Sidebar para móviles */}
      <div className="lg:hidden">
        {/* Implementar sidebar móvil aquí */}
      </div>

      {/* Sidebar para desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4">
            <h1 className="text-lg font-semibold text-gray-900">Sistema Médico</h1>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                    isActive
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}
