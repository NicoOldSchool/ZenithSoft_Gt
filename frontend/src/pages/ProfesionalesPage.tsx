import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Profesional } from '@/types';
import { Plus, Search, Edit, Trash2, Eye, UserCheck } from 'lucide-react';

const ProfesionalesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProfesional, setSelectedProfesional] = useState<Profesional | null>(null);
  const [filters, setFilters] = useState({
    especialidad: '',
    activo: '',
  });

  const { data: profesionalesData, isLoading, refetch } = useQuery({
    queryKey: ['profesionales', currentPage, searchTerm, filters],
    queryFn: () => api.getProfesionales({
      page: currentPage,
      limit: 10,
      search: searchTerm,
      ...filters,
    }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    refetch();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profesionales</h1>
          <p className="text-gray-600">
            Gestiona los profesionales de tu establecimiento
          </p>
        </div>
        <button className="btn btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Profesional
        </button>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="card-content">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Nombre, apellido, especialidad..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especialidad
                </label>
                <input
                  type="text"
                  placeholder="Especialidad..."
                  value={filters.especialidad}
                  onChange={(e) => setFilters({ ...filters, especialidad: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={filters.activo}
                  onChange={(e) => setFilters({ ...filters, activo: e.target.value })}
                  className="input"
                >
                  <option value="">Todos</option>
                  <option value="true">Activos</option>
                  <option value="false">Inactivos</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn btn-secondary">
                Buscar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Tabla de Profesionales */}
      <div className="card">
        <div className="card-content">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : profesionalesData?.profesionales && profesionalesData.profesionales.length > 0 ? (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profesional
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
                      Estado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {profesionalesData.profesionales.map((profesional) => (
                    <tr key={profesional.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          Dr. {profesional.apellido} {profesional.nombre}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {profesional.id.slice(0, 8)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {profesional.especialidad}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {profesional.telefono || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {profesional.email || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          profesional.activo 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {profesional.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setSelectedProfesional(profesional)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay profesionales</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comienza agregando un nuevo profesional.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Paginación */}
      {profesionalesData?.pagination && profesionalesData.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando{' '}
            <span className="font-medium">
              {(currentPage - 1) * 10 + 1}
            </span>{' '}
            a{' '}
            <span className="font-medium">
              {Math.min(currentPage * 10, profesionalesData.pagination.total)}
            </span>{' '}
            de{' '}
            <span className="font-medium">{profesionalesData.pagination.total}</span>{' '}
            resultados
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn btn-outline btn-sm disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === profesionalesData.pagination.totalPages}
              className="btn btn-outline btn-sm disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Modal de Detalles del Profesional */}
      {selectedProfesional && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Detalles del Profesional
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nombre Completo</label>
                  <p className="text-sm text-gray-900">
                    Dr. {selectedProfesional.apellido} {selectedProfesional.nombre}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Especialidad</label>
                  <p className="text-sm text-gray-900">{selectedProfesional.especialidad}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Teléfono</label>
                  <p className="text-sm text-gray-900">{selectedProfesional.telefono || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-sm text-gray-900">{selectedProfesional.email || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Estado</label>
                  <p className="text-sm text-gray-900">
                    {selectedProfesional.activo ? 'Activo' : 'Inactivo'}
                  </p>
                </div>
                {selectedProfesional.disponibilidad && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Disponibilidad</label>
                    <div className="text-sm text-gray-900">
                      {Object.entries(selectedProfesional.disponibilidad).map(([dia, horario]) => (
                        <div key={dia}>
                          {dia}: {horario.inicio} - {horario.fin}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={() => setSelectedProfesional(null)}
                  className="btn btn-secondary btn-sm"
                >
                  Cerrar
                </button>
                <button className="btn btn-primary btn-sm">
                  Editar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfesionalesPage;
