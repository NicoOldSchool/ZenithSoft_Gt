import { formatDateTime } from '@/lib/utils'

interface TurnoWithRelations {
  id: string
  fecha_hora: string
  estado: string
  especialidad: string | null
  pacientes: {
    apellido: string
    nombre: string
  } | null
  profesionales: {
    apellido: string
    nombre: string
  } | null
}

interface RecentTurnosProps {
  turnos: TurnoWithRelations[]
}

export function RecentTurnos({ turnos }: RecentTurnosProps) {
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'programado':
        return 'bg-blue-100 text-blue-800'
      case 'completado':
        return 'bg-green-100 text-green-800'
      case 'cancelado':
        return 'bg-red-100 text-red-800'
      case 'ausente':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case 'programado':
        return 'Programado'
      case 'completado':
        return 'Completado'
      case 'cancelado':
        return 'Cancelado'
      case 'ausente':
        return 'Ausente'
      default:
        return estado
    }
  }

  return (
    <div className="card">
      <div className="card-content">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Próximos Turnos
        </h3>
        {turnos.length > 0 ? (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha y Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paciente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profesional
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Especialidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {turnos.map((turno) => (
                  <tr key={turno.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDateTime(turno.fecha_hora)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {turno.pacientes
                        ? `${turno.pacientes.apellido}, ${turno.pacientes.nombre}`
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {turno.profesionales
                        ? `${turno.profesionales.apellido}, ${turno.profesionales.nombre}`
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {turno.especialidad || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(
                          turno.estado
                        )}`}
                      >
                        {getEstadoText(turno.estado)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No hay turnos programados</p>
          </div>
        )}
      </div>
    </div>
  )
}
