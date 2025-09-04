import { SupabaseTest } from '@/components/supabase-test'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Prueba de Configuración
          </h1>
          <p className="mt-2 text-gray-600">
            Verifica que la conexión con Supabase esté funcionando correctamente
          </p>
        </div>

        <div className="space-y-6">
          <SupabaseTest />
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Checklist de Configuración
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                <span>Variables de entorno configuradas</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                <span>Dependencias instaladas</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                <span>Migraciones ejecutadas en Supabase</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                <span>Datos de ejemplo insertados</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              Próximos Pasos
            </h3>
            <ul className="text-blue-800 space-y-1">
              <li>• Ejecutar migraciones en Supabase Dashboard</li>
              <li>• Insertar datos de ejemplo</li>
              <li>• Probar registro de usuarios</li>
              <li>• Probar login y autenticación</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
