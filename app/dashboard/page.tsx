import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { DashboardStats } from '@/components/dashboard-stats'
import { RecentTurnos } from '@/components/recent-turnos'

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  // Obtener datos del usuario y su establecimiento
  const { data: user } = await supabase
    .from('users')
    .select('*, establecimientos(*)')
    .eq('id', session.user.id)
    .single()

  if (!user) {
    return null
  }

  // Obtener estadísticas
  const [turnosCount, pacientesCount, profesionalesCount] = await Promise.all([
    supabase
      .from('turnos')
      .select('*', { count: 'exact', head: true })
      .eq('establecimiento_id', user.establecimiento_id),
    supabase
      .from('pacientes')
      .select('*', { count: 'exact', head: true })
      .eq('establecimiento_id', user.establecimiento_id),
    supabase
      .from('profesionales')
      .select('*', { count: 'exact', head: true })
      .eq('establecimiento_id', user.establecimiento_id)
      .eq('activo', true),
  ])

  // Obtener turnos recientes
  const { data: recentTurnos } = await supabase
    .from('turnos')
    .select(`
      *,
      pacientes(apellido, nombre),
      profesionales(apellido, nombre)
    `)
    .eq('establecimiento_id', user.establecimiento_id)
    .gte('fecha_hora', new Date().toISOString())
    .order('fecha_hora', { ascending: true })
    .limit(5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Bienvenido a {user.establecimientos?.nombre}
        </p>
      </div>

      <DashboardStats
        turnosCount={turnosCount.count || 0}
        pacientesCount={pacientesCount.count || 0}
        profesionalesCount={profesionalesCount.count || 0}
      />

      <RecentTurnos turnos={recentTurnos || []} />
    </div>
  )
}
