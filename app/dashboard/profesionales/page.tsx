'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Profesional {
  id: string
  nombre: string
  apellido: string
  telefono?: string
  email?: string
  especialidad: string
  disponibilidad?: any
  created_at: string
}

export default function ProfesionalesPage() {
  const [profesionales, setProfesionales] = useState<Profesional[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEspecialidad, setFilterEspecialidad] = useState('')

  useEffect(() => {
    fetchProfesionales()
  }, [])

  const fetchProfesionales = async () => {
    try {
      const { data, error } = await supabase
        .from('profesionales')
        .select('*')
        .order('apellido', { ascending: true })

      if (error) throw error
      setProfesionales(data || [])
    } catch (error) {
      console.error('Error fetching profesionales:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProfesionales = profesionales.filter(profesional => {
    const matchesSearch = `${profesional.nombre} ${profesional.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profesional.especialidad.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEspecialidad = !filterEspecialidad || profesional.especialidad === filterEspecialidad
    
    return matchesSearch && matchesEspecialidad
  })

  const especialidades = Array.from(new Set(profesionales.map(p => p.especialidad)))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profesionales</h1>
          <p className="text-gray-600">Gestión de profesionales médicos</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Nuevo Profesional
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre o especialidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
          </div>
          
          <select
            value={filterEspecialidad}
            onChange={(e) => setFilterEspecialidad(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todas las especialidades</option>
            {especialidades.map(especialidad => (
              <option key={especialidad} value={especialidad}>
                {especialidad}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Apellido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Especialidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Disponibilidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProfesionales.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    {searchTerm || filterEspecialidad ? 'No se encontraron profesionales' : 'No hay profesionales registrados'}
                  </td>
                </tr>
              ) : (
                filteredProfesionales.map((profesional) => (
                  <tr key={profesional.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {profesional.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {profesional.apellido}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {profesional.especialidad}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {profesional.telefono || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {profesional.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {profesional.disponibilidad ? 'Configurada' : 'No configurada'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        Editar
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
