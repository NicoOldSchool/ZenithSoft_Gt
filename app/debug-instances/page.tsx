'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function DebugInstancesPage() {
  const [instances, setInstances] = useState<any[]>([])
  const [localStorageData, setLocalStorageData] = useState<any>({})
  const [sessionStorageData, setSessionStorageData] = useState<any>({})
  const [globalSupabaseInfo, setGlobalSupabaseInfo] = useState<any>({})

  useEffect(() => {
    const checkInstances = () => {
      const instances = []
      
      // Verificar si hay múltiples instancias en el objeto global
      if (typeof window !== 'undefined') {
        // Verificar globalThis.__supabase
        if ((globalThis as any).__supabase) {
          instances.push({
            type: 'Global Singleton',
            key: '__supabase',
            value: (globalThis as any).__supabase,
            url: 'Detected'
          })
        }

        // Verificar otras posibles instancias
        const globalKeys = Object.keys(window).filter(key => 
          key.includes('supabase') || key.includes('__supabase')
        )
        
        globalKeys.forEach(key => {
          if (key !== '__supabase') {
            instances.push({
              type: 'Global Variable',
              key,
              value: (window as any)[key]
            })
          }
        })

        // Verificar si hay instancias en el objeto global de Supabase
        if (typeof window !== 'undefined' && (window as any).supabase) {
          instances.push({
            type: 'Window.supabase',
            key: 'supabase',
            value: (window as any).supabase
          })
        }
      }
      
      setInstances(instances)
    }

    // Verificar localStorage
    const supabaseKeys = Object.keys(localStorage).filter(key => 
      key.includes('supabase') || key.includes('sb-')
    )
    
    const localStorageInfo: any = {}
    supabaseKeys.forEach(key => {
      try {
        localStorageInfo[key] = JSON.parse(localStorage.getItem(key) || '{}')
      } catch {
        localStorageInfo[key] = localStorage.getItem(key)
      }
    })
    
    setLocalStorageData(localStorageInfo)

    // Verificar sessionStorage
    const sessionKeys = Object.keys(sessionStorage).filter(key => 
      key.includes('supabase') || key.includes('sb-')
    )
    
    const sessionStorageInfo: any = {}
    sessionKeys.forEach(key => {
      try {
        sessionStorageInfo[key] = JSON.parse(sessionStorage.getItem(key) || '{}')
      } catch {
        sessionStorageInfo[key] = sessionStorage.getItem(key)
      }
    })
    
    setSessionStorageData(sessionStorageInfo)

    // Información del cliente actual
    setGlobalSupabaseInfo({
      url: 'https://ltuisrccawjeigwxlyqq.supabase.co',
      key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      authUrl: 'https://ltuisrccawjeigwxlyqq.supabase.co/auth/v1',
      isClient: typeof window !== 'undefined',
      hasGlobalInstance: !!(globalThis as any).__supabase
    })

    checkInstances()
  }, [])

  const clearStorage = () => {
    // Limpiar localStorage
    const supabaseKeys = Object.keys(localStorage).filter(key => 
      key.includes('supabase') || key.includes('sb-')
    )
    supabaseKeys.forEach(key => localStorage.removeItem(key))

    // Limpiar sessionStorage
    const sessionKeys = Object.keys(sessionStorage).filter(key => 
      key.includes('supabase') || key.includes('sb-')
    )
    sessionKeys.forEach(key => sessionStorage.removeItem(key))

    // Limpiar instancias globales
    if (typeof window !== 'undefined') {
      delete (globalThis as any).__supabase
      delete (globalThis as any).__supabaseAdmin
    }

    // Recargar la página
    window.location.reload()
  }

  const testConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('establecimientos')
        .select('count')
        .limit(1)
      
      if (error) {
        alert(`Error: ${error.message}`)
      } else {
        alert('Conexión exitosa!')
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    }
  }

  const forceNewInstance = () => {
    if (typeof window !== 'undefined') {
      // Forzar creación de nueva instancia
      delete (globalThis as any).__supabase
      delete (globalThis as any).__supabaseAdmin
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🔍 Debug: Múltiples Instancias de Supabase
        </h1>

        <div className="grid gap-6">
          {/* Instancias Detectadas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Instancias Detectadas ({instances.length})
            </h2>
            {instances.length > 0 ? (
              <div className="space-y-2">
                {instances.map((instance, index) => (
                  <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="font-medium text-yellow-800">{instance.type}</p>
                    <p className="text-sm text-yellow-700">{instance.key}</p>
                    {instance.url && (
                      <p className="text-xs text-yellow-600">URL: {instance.url}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-green-600">✅ No se detectaron múltiples instancias</p>
            )}
          </div>

          {/* Información del Cliente Actual */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Cliente Supabase Actual
            </h2>
            <div className="space-y-2">
              <p><strong>URL:</strong> {globalSupabaseInfo.url}</p>
              <p><strong>Key:</strong> {globalSupabaseInfo.key}</p>
              <p><strong>Auth URL:</strong> {globalSupabaseInfo.authUrl}</p>
              <p><strong>Es Cliente:</strong> {globalSupabaseInfo.isClient ? 'Sí' : 'No'}</p>
              <p><strong>Tiene Instancia Global:</strong> {globalSupabaseInfo.hasGlobalInstance ? 'Sí' : 'No'}</p>
            </div>
          </div>

          {/* localStorage */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              localStorage Supabase ({Object.keys(localStorageData).length} items)
            </h2>
            {Object.keys(localStorageData).length > 0 ? (
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-40">
                {JSON.stringify(localStorageData, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-500">No hay datos de Supabase en localStorage</p>
            )}
          </div>

          {/* sessionStorage */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              sessionStorage Supabase ({Object.keys(sessionStorageData).length} items)
            </h2>
            {Object.keys(sessionStorageData).length > 0 ? (
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-40">
                {JSON.stringify(sessionStorageData, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-500">No hay datos de Supabase en sessionStorage</p>
            )}
          </div>

          {/* Acciones */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Acciones
            </h2>
            <div className="space-x-4 space-y-2">
              <button
                onClick={testConnection}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Probar Conexión
              </button>
              <button
                onClick={clearStorage}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Limpiar Storage y Recargar
              </button>
              <button
                onClick={forceNewInstance}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Forzar Nueva Instancia
              </button>
            </div>
          </div>

          {/* Información de Ayuda */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              ⚠️ Problema: Múltiples Instancias de GoTrueClient
            </h3>
            <p className="text-yellow-700 mb-4">
              Este warning indica que se están creando múltiples instancias del cliente de autenticación de Supabase, 
              lo que puede causar comportamientos inesperados.
            </p>
            
            <h4 className="font-medium text-yellow-900 mb-2">Posibles Causas:</h4>
            <ul className="text-yellow-800 space-y-1 text-sm">
              <li>• Múltiples imports de createClient en diferentes archivos</li>
              <li>• Uso de @supabase/auth-helpers-nextjs junto con @supabase/supabase-js</li>
              <li>• Instancias creadas en diferentes contextos (servidor/cliente)</li>
              <li>• Hot reload en desarrollo causando re-creación de instancias</li>
              <li>• Problemas con el bundling de Next.js</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}