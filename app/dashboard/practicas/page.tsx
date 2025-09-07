'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Practica {
  id: string
  codigo: string
  nombre: string
  categoria?: string
  turno_id?: string
  created_at: string
  turno?: {
    fecha_hora: string
    paciente?: {
      nombre: string
      apellido: string
    }
  }
}

export default function PracticasPage() {
  const [practicas, setPracticas] = useState<Practica[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategoria, setFilterCategoria] = useState('')

  useEffect(() => {
    fetchPracticas()
  }, [])

  const fetchPracticas = async () => {
    try {
      const { data, error } = await supabase
        .from('practicas')
        .select(`
          *,
          turno:turnos(
            fecha_hora,
            paciente:pacientes(nombre, apellido)
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPracticas(data || [])
    } catch (error) {
      console.error('Error fetching practicas:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPracticas = practicas.filter(practica => {
    const matchesSearch = practica.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         practica.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategoria = !filterCategoria || practica.categoria === filterCategoria
    
    return matchesSearch && matchesCategoria
  })

  const categorias = Array.from(new Set(practicas.map(p => p.categoria).filter(Boolean)))

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Prácticas</h1>
          <p className="text-gray-600">Gestión de prácticas médicas</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Nueva Práctica
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
          </div>
          
          <select
            value={filterCategoria}
            onChange={(e) => setFilterCategoria(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todas las categorías</option>
            {categorias.map(categoria => (
              <option key={categoria} value={categoria}>
                {categoria}
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
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Turno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paciente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Creación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPracticas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    {searchTerm || filterCategoria ? 'No se encontraron prácticas' : 'No hay prácticas registradas'}
                  </td>
                </tr>
              ) : (
                filteredPracticas.map((practica) => (
                  <tr key={practica.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {practica.codigo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {practica.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {practica.categoria ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                          {practica.categoria}
                        </span>
                      ) : (
                        <span className="text-gray-400">Sin categoría</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {practica.turno ? formatFecha(practica.turno.fecha_hora) : 'Sin turno'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {practica.turno?.paciente ? 
                        `${practica.turno.paciente.nombre} ${practica.turno.paciente.apellido}` : 
                        'N/A'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(practica.created_at).toLocaleDateString('es-ES')}
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
