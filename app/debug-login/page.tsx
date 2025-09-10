'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function DebugLoginPage() {
  const supabase = createClient()
  const [session, setSession] = useState<any>(null)
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        setError(error)
      } else {
        setSession(data)
      }
      setLoading(false)
    }
    getSession()
  }, [supabase])

  const testConnection = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        setTestResult(`Error en la sesión: ${error.message}`)
      } else {
        setTestResult(`Conexión exitosa. Usuario: ${data.session?.user?.email || 'No logueado'}`)
      }
    } catch (err: any) {
      setTestResult(`Error de conexión: ${err.message}`)
    }
    setLoading(false)
  }

  const testLogin = async () => {
    setLoading(true)
    try {
      // Intenta hacer login con credenciales de prueba
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'testpassword'
      })
      
      if (error) {
        setTestResult(`Error de login: ${error.message}`)
      } else {
        setTestResult(`Login exitoso: ${data.user?.email}`)
      }
    } catch (err: any) {
      setTestResult(`Error de login: ${err.message}`)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug Login</h1>
        
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Variables de Entorno</h2>
            <div className="space-y-2 text-sm">
              <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || 'No definida'}</p>
              <p><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Definida' : 'No definida'}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Cliente Supabase</h2>
            <p className="text-sm">Cliente inicializado: {supabase ? 'Sí' : 'No'}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Pruebas</h2>
            <div className="space-x-4">
              <button
                onClick={testConnection}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Probar Conexión
              </button>
              
              <button
                onClick={testLogin}
                disabled={loading}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
              >
                Probar Login
              </button>
            </div>
          </div>

          {testResult && (
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="font-semibold mb-2">Resultado:</h3>
              <p className="text-sm">{testResult}</p>
            </div>
          )}
        </div>

        <div className="mt-8">
          <a href="/login" className="text-blue-600 hover:text-blue-800">
            ← Volver al Login
          </a>
        </div>
      </div>
    </div>
  )
}
