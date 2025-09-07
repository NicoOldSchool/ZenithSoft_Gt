'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

import { Paciente, PacienteUpdate, PacienteInsert } from '@/types/database'

interface HistorialMedico {
  id: string
  paciente_id: string
  fecha_consulta: string
  profesional_id?: string
  motivo_consulta?: string
  diagnostico?: string
  tratamiento?: string
  observaciones?: string
  created_at: string
}

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingPaciente, setEditingPaciente] = useState<Paciente | null>(null)
  const [showHistorial, setShowHistorial] = useState(false)
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null)
  const [historial, setHistorial] = useState<HistorialMedico[]>([])
  const [formData, setFormData] = useState<Omit<PacienteInsert, 'establecimiento_id'>>({
    dni: '',
    nombre: '',
    apellido: '',
    telefono: '',
    email: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchPacientes()
  }, [])

  const fetchPacientes = async () => {
    try {
      const { data, error } = await supabase
        .from('pacientes')
        .select('*')
        .eq('activo', true)
        .order('apellido', { ascending: true })

      if (error) throw error
      setPacientes(data || [])
    } catch (error) {
      console.error('Error fetching pacientes:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchHistorial = async (pacienteId: string) => {
    try {
      const { data, error } = await supabase
        .from('historial_medico')
        .select('*')
        .eq('paciente_id', pacienteId)
        .order('fecha_consulta', { ascending: false })

      if (error) throw error
      setHistorial(data || [])
    } catch (error) {
      console.error('Error fetching historial:', error)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.dni.trim()) {
      newErrors.dni = 'El DNI es requerido'
    } else if (!/^\d{7,8}$/.test(formData.dni.replace(/\D/g, ''))) {
      newErrors.dni = 'El DNI debe tener 7 u 8 dígitos'
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido'
    }

    if (formData.telefono && !/^[\d\s\-\+\(\)]+$/.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono no es válido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      if (editingPaciente) {
        // Actualizar paciente existente
        const { error } = await (supabase as any)
          .from('pacientes')
          .update({
            dni: formData.dni,
            nombre: formData.nombre,
            apellido: formData.apellido,
            telefono: formData.telefono,
            email: formData.email
          })
          .eq('id', editingPaciente.id)

        if (error) throw error
      } else {
        // Crear nuevo paciente
        const { error } = await (supabase as any)
          .from('pacientes')
          .insert([{
            ...formData,
            establecimiento_id: 'default-establecimiento-id' // TODO: Obtener del usuario logueado
          }])

        if (error) throw error
      }

      await fetchPacientes()
      resetForm()
      setShowModal(false)
    } catch (error: any) {
      console.error('Error saving paciente:', error)
      if (error.message.includes('duplicate key')) {
        setErrors({ dni: 'Ya existe un paciente con este DNI' })
      }
    }
  }

  const handleEdit = (paciente: Paciente) => {
    setEditingPaciente(paciente)
    setFormData({
      dni: paciente.dni,
      nombre: paciente.nombre,
      apellido: paciente.apellido,
      telefono: paciente.telefono || '',
      email: paciente.email || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (paciente: Paciente) => {
    if (!confirm(`¿Estás seguro de eliminar a ${paciente.nombre} ${paciente.apellido}?`)) return

    try {
      const { error } = await (supabase as any)
        .from('pacientes')
        .delete()
        .eq('id', paciente.id)

      if (error) throw error
      await fetchPacientes()
    } catch (error) {
      console.error('Error deleting paciente:', error)
    }
  }

  const handleViewHistorial = async (paciente: Paciente) => {
    setSelectedPaciente(paciente)
    await fetchHistorial(paciente.id)
    setShowHistorial(true)
  }

  const resetForm = () => {
    setFormData({
      dni: '',
      nombre: '',
      apellido: '',
      telefono: '',
      email: ''
    })
    setEditingPaciente(null)
    setErrors({})
  }

  const filteredPacientes = pacientes.filter(paciente =>
    `${paciente.nombre} ${paciente.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.dni.includes(searchTerm)
  )

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
          <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-gray-600">Gestión de pacientes del sistema</p>
        </div>
        <button 
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Nuevo Paciente
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o DNI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">🔍</span>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DNI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Apellido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPacientes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    {searchTerm ? 'No se encontraron pacientes' : 'No hay pacientes registrados'}
                  </td>
                </tr>
              ) : (
                filteredPacientes.map((paciente) => (
                  <tr key={paciente.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {paciente.dni}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {paciente.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {paciente.apellido}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {paciente.telefono || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {paciente.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewHistorial(paciente)}
                          className="text-green-600 hover:text-green-900"
                          title="Ver Historial"
                        >
                          📋
                        </button>
                        <button 
                          onClick={() => handleEdit(paciente)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDelete(paciente)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para crear/editar paciente */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingPaciente ? 'Editar Paciente' : 'Nuevo Paciente'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">DNI *</label>
                    <input
                      type="text"
                      value={formData.dni}
                      onChange={(e) => setFormData({...formData, dni: e.target.value})}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md ${errors.dni ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="12345678"
                    />
                    {errors.dni && <p className="text-red-500 text-xs mt-1">{errors.dni}</p>}
                  </div>


                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre *</label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Apellido *</label>
                    <input
                      type="text"
                      value={formData.apellido}
                      onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md ${errors.apellido ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>}
                  </div>


                  <div>
                    <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                    <input
                      type="text"
                      value={formData.telefono || ''}
                      onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md ${errors.telefono ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="011-1234-5678"
                    />
                    {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="paciente@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                </div>



                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingPaciente ? 'Actualizar' : 'Crear'} Paciente
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver historial médico */}
      {showHistorial && selectedPaciente && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Historial Médico - {selectedPaciente.nombre} {selectedPaciente.apellido}
                </h3>
                <button
                  onClick={() => setShowHistorial(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {historial.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No hay registros en el historial médico</p>
                ) : (
                  historial.map((registro) => (
                    <div key={registro.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">
                          {new Date(registro.fecha_consulta).toLocaleDateString('es-ES')}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {new Date(registro.created_at).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                      
                      {registro.motivo_consulta && (
                        <div className="mb-2">
                          <span className="font-medium text-gray-700">Motivo: </span>
                          <span className="text-gray-900">{registro.motivo_consulta}</span>
                        </div>
                      )}
                      
                      {registro.diagnostico && (
                        <div className="mb-2">
                          <span className="font-medium text-gray-700">Diagnóstico: </span>
                          <span className="text-gray-900">{registro.diagnostico}</span>
                        </div>
                      )}
                      
                      {registro.tratamiento && (
                        <div className="mb-2">
                          <span className="font-medium text-gray-700">Tratamiento: </span>
                          <span className="text-gray-900">{registro.tratamiento}</span>
                        </div>
                      )}
                      
                      {registro.observaciones && (
                        <div>
                          <span className="font-medium text-gray-700">Observaciones: </span>
                          <span className="text-gray-900">{registro.observaciones}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setShowHistorial(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
