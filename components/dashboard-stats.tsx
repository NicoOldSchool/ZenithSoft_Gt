import { Calendar, Users, UserCheck } from 'lucide-react'

interface DashboardStatsProps {
  turnosCount: number
  pacientesCount: number
  profesionalesCount: number
}

export function DashboardStats({
  turnosCount,
  pacientesCount,
  profesionalesCount,
}: DashboardStatsProps) {
  const stats = [
    {
      name: 'Turnos Programados',
      value: turnosCount,
      icon: Calendar,
      color: 'bg-blue-500',
    },
    {
      name: 'Pacientes',
      value: pacientesCount,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      name: 'Profesionales Activos',
      value: profesionalesCount,
      icon: UserCheck,
      color: 'bg-purple-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.name} className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-md ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
