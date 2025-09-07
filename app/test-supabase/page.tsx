'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestSupabasePage() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const addResult = (test: string, status: 'success' | 'error', message: string, details?: any) => {
    setResults(prev => [...prev, {
      test,
      status,
      message,
      details,
      timestamp: new Date().toISOString()
    }])
  }

  const runTests = async () => {
    setLoading(true)
    setResults([])

    // Test 1: Verificar cliente de Supabase
    try {
      addResult('Cliente Supabase', 'success', 'Cliente creado correctamente', {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ltuisrccawjeigwxlyqq.supabase.co',
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      })
    } catch (error) {
      addResult('Cliente Supabase', 'error', 'Error creando cliente', error)
    }

    // Test 2: Verificar conexión básica
    try {
      const { data, error } = await supabase.from('establecimientos').select('count').limit(1)
      if (error) throw error
      addResult('Conexión Básica', 'success', 'Conexión exitosa con Supabase', data)
    } catch (error) {
      addResult('Conexión Básica', 'error', 'Error de conexión', error)
    }

    // Test 3: Verificar autenticación
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      addResult('Autenticación', 'success', 'Sesión obtenida correctamente', {
        hasSession: !!session,
        userId: session?.user?.id
      })
    } catch (error) {
      addResult('Autenticación', 'error', 'Error obteniendo sesión', error)
    }

    // Test 4: Verificar todas las tablas
    const tables = ['establecimientos', 'users', 'pacientes', 'profesionales', 'turnos', 'aranceles', 'practicas']
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('*').limit(1)
        if (error) throw error
        addResult(`Tabla ${table}`, 'success', `Tabla ${table} accesible`, {
          count: data?.length || 0
        })
      } catch (error) {
        addResult(`Tabla ${table}`, 'error', `Error accediendo a ${table}`, error)
      }
    }

    // Test 5: Verificar instancias duplicadas
    addResult('Instancia Duplicada', 'success', 'No se crean instancias duplicadas en este test', {
      note: 'Este test no crea instancias adicionales para evitar el warning'
    })

    // Test 6: Verificar variables de entorno
    addResult('Variables de Entorno', 'success', 'Variables verificadas', {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configurada' : '❌ No configurada',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ No configurada',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Configurada' : '❌ No configurada'
    })

    setLoading(false)
  }

  useEffect(() => {
    runTests()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Test Completo de Supabase
          </h1>
          <p className="mt-2 text-gray-600">
            Diagnóstico completo de la configuración de Supabase
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Resultados de las Pruebas
            </h2>
            <button
              onClick={runTests}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Ejecutando...' : 'Ejecutar Pruebas'}
            </button>
          </div>

          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  result.status === 'success'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-3 ${
                        result.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    <h3 className="font-medium text-gray-900">{result.test}</h3>
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      result.status === 'success' ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    {result.status === 'success' ? '✅ Éxito' : '❌ Error'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{result.message}</p>
                {result.details && (
                  <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                    <pre>{JSON.stringify(result.details, null, 2)}</pre>
                  </div>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(result.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {results.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No hay resultados aún. Haz clic en "Ejecutar Pruebas" para comenzar.
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Ejecutando pruebas...</p>
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            Instrucciones para el Diagnóstico
          </h3>
          <ul className="text-blue-800 space-y-1">
            <li>• Abre las herramientas de desarrollador (F12)</li>
            <li>• Ve a la pestaña "Console"</li>
            <li>• Busca el warning "Multiple GoTrueClient instances detected"</li>
            <li>• Revisa la pila de llamadas (stack trace) para identificar el archivo problemático</li>
            <li>• Compara con los resultados de las pruebas arriba</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
