'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    turnos: 0,
    pacientes: 0,
    profesionales: 0,
    aranceles: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Obtener estadísticas de cada tabla
        const [turnos, pacientes, profesionales, aranceles] = await Promise.all([
          supabase.from('turnos').select('*', { count: 'exact', head: true }),
          supabase.from('pacientes').select('*', { count: 'exact', head: true }),
          supabase.from('profesionales').select('*', { count: 'exact', head: true }),
          supabase.from('aranceles').select('*', { count: 'exact', head: true })
        ])

        setStats({
          turnos: turnos.count || 0,
          pacientes: pacientes.count || 0,
          profesionales: profesionales.count || 0,
          aranceles: aranceles.count || 0
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Resumen del sistema médico</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Turnos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.turnos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pacientes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pacientes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">👨‍⚕️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Profesionales</p>
              <p className="text-2xl font-bold text-gray-900">{stats.profesionales}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Aranceles</p>
              <p className="text-2xl font-bold text-gray-900">{stats.aranceles}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="flex items-center">
              <span className="text-2xl mr-3">➕</span>
              <div>
                <p className="font-medium">Nuevo Turno</p>
                <p className="text-sm text-gray-600">Agendar cita</p>
              </div>
            </div>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="flex items-center">
              <span className="text-2xl mr-3">👤</span>
              <div>
                <p className="font-medium">Nuevo Paciente</p>
                <p className="text-sm text-gray-600">Registrar paciente</p>
              </div>
            </div>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
            <div className="flex items-center">
              <span className="text-2xl mr-3">👨‍⚕️</span>
              <div>
                <p className="font-medium">Nuevo Profesional</p>
                <p className="text-sm text-gray-600">Agregar profesional</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}