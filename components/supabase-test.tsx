'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database'

export function SupabaseTest() {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const supabase = createClientComponentClient<Database>()

  const testConnection = async () => {
    setStatus('testing')
    setMessage('Probando conexión...')

    try {
      // Probar conexión básica
      const { data, error } = await supabase
        .from('establecimientos')
        .select('count')
        .limit(1)

      if (error) {
        throw error
      }

      setStatus('success')
      setMessage('✅ Conexión exitosa con Supabase!')
    } catch (error: any) {
      setStatus('error')
      setMessage(`❌ Error de conexión: ${error.message}`)
    }
  }

  const testAuth = async () => {
    setStatus('testing')
    setMessage('Probando autenticación...')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        setStatus('success')
        setMessage('✅ Usuario autenticado')
      } else {
        setStatus('success')
        setMessage('✅ No hay sesión activa (normal)')
      }
    } catch (error: any) {
      setStatus('error')
      setMessage(`❌ Error de autenticación: ${error.message}`)
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Prueba de Conexión Supabase
      </h3>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={testConnection}
            disabled={status === 'testing'}
            className="btn btn-primary"
          >
            Probar Conexión
          </button>
          
          <button
            onClick={testAuth}
            disabled={status === 'testing'}
            className="btn btn-secondary"
          >
            Probar Auth
          </button>
        </div>

        {message && (
          <div className={`p-3 rounded-md ${
            status === 'success' ? 'bg-green-50 text-green-800' :
            status === 'error' ? 'bg-red-50 text-red-800' :
            'bg-blue-50 text-blue-800'
          }`}>
            {message}
          </div>
        )}

                 <div className="text-sm text-gray-600">
           <p><strong>URL:</strong> https://ltuisrccawjeigwxlqq.supabase.co</p>
           <p><strong>DB Host:</strong> db.ltuisrccawjeigwxlyqq.supabase.co:5432</p>
           <p><strong>Estado:</strong> {status}</p>
         </div>
      </div>
    </div>
  )
}
