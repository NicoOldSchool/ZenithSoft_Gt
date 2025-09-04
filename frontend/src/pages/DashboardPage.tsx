import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Users, UserCheck, DollarSign, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const { data: turnosData } = useQuery({
    queryKey: ['turnos', 'dashboard'],
    queryFn: () => api.getTurnos({ limit: 5, page: 1 }),
  });

  const { data: pacientesData } = useQuery({
    queryKey: ['pacientes', 'dashboard'],
    queryFn: () => api.getPacientes({ limit: 5, page: 1 }),
  });

  const { data: profesionalesData } = useQuery({
    queryKey: ['profesionales', 'dashboard'],
    queryFn: () => api.getProfesionales({ limit: 5, page: 1 }),
  });

  const stats = [
    {
      name: 'Turnos Hoy',
      value: turnosData?.turnos?.filter(t => 
        format(new Date(t.fecha_hora), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
      ).length || 0,
      icon: Calendar,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Pacientes',
      value: pacientesData?.pagination?.total || 0,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      name: 'Profesionales Activos',
      value: profesionalesData?.profesionales?.filter(p => p.activo).length || 0,
      icon: UserCheck,
      color: 'bg-purple-500',
    },
    {
      name: 'Turnos Pendientes',
      value: turnosData?.turnos?.filter(t => t.estado === 'Pendiente').length || 0,
      icon: Activity,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Bienvenido, {user?.nombre}. Aquí tienes un resumen de tu establecimiento.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="card-content">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
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

      {/* Turnos Recientes */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Turnos Recientes</h2>
          <p className="card-description">
            Los próximos turnos programados
          </p>
        </div>
        <div className="card-content">
          {turnosData?.turnos && turnosData.turnos.length > 0 ? (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paciente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profesional
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha y Hora
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {turnosData.turnos.map((turno) => (
                    <tr key={turno.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {turno.paciente_apellido} {turno.paciente_nombre}
                        </div>
                        <div className="text-sm text-gray-500">
                          DNI: {turno.paciente_apellido ? '***' : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          Dr. {turno.profesional_apellido} {turno.profesional_nombre}
                        </div>
                        <div className="text-sm text-gray-500">
                          {turno.profesional_especialidad}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(new Date(turno.fecha_hora), 'dd/MM/yyyy', { locale: es })}
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(turno.fecha_hora), 'HH:mm', { locale: es })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          turno.estado === 'Confirmado' ? 'bg-green-100 text-green-800' :
                          turno.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                          turno.estado === 'Cancelado' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {turno.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay turnos</h3>
              <p className="mt-1 text-sm text-gray-500">
                No hay turnos programados para mostrar.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Información del Establecimiento */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Información del Establecimiento</h2>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Detalles</h3>
              <dl className="mt-2 space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Nombre</dt>
                  <dd className="text-sm text-gray-900">{user?.establecimiento_nombre}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Tu Rol</dt>
                  <dd className="text-sm text-gray-900">{user?.rol}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="text-sm text-gray-900">{user?.email}</dd>
                </div>
              </dl>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Acciones Rápidas</h3>
              <div className="mt-2 space-y-2">
                <button className="w-full btn btn-primary btn-sm">
                  Nuevo Turno
                </button>
                <button className="w-full btn btn-secondary btn-sm">
                  Nuevo Paciente
                </button>
                <button className="w-full btn btn-outline btn-sm">
                  Ver Agenda
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
