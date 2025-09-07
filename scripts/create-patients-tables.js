// Script para crear tablas de pacientes usando fetch
const SUPABASE_URL = 'https://ltuisrccawjeigwxlyqq.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0dWlzcmNjYXdqZWlnd3hseXFxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njk0OTA3MiwiZXhwIjoyMDcyNTI1MDcyfQ.MvHvzGjScFLmflLdUwAjjBH9bkIM4M6hy23TaBFEJWA'

async function createPatientsTables() {
  console.log('🏥 Creando tablas de pacientes...')
  
  try {
    // Crear tabla pacientes
    const pacientesResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sql: `
          CREATE TABLE IF NOT EXISTS pacientes (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            dni VARCHAR(20) UNIQUE NOT NULL,
            apellido VARCHAR(100) NOT NULL,
            nombre VARCHAR(100) NOT NULL,
            fecha_nacimiento DATE,
            sexo VARCHAR(10) CHECK (sexo IN ('M', 'F', 'Otro')),
            telefono VARCHAR(20),
            email VARCHAR(100),
            direccion TEXT,
            obra_social VARCHAR(100),
            numero_afiliado VARCHAR(50),
            observaciones TEXT,
            activo BOOLEAN DEFAULT true,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
        `
      })
    })

    if (pacientesResponse.ok) {
      console.log('✅ Tabla pacientes creada')
    } else {
      console.log('ℹ️ Tabla pacientes ya existe o error')
    }

    // Crear tabla historial médico
    const historialResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sql: `
          CREATE TABLE IF NOT EXISTS historial_medico (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
            fecha_consulta DATE NOT NULL DEFAULT CURRENT_DATE,
            profesional_id UUID REFERENCES profesionales(id),
            motivo_consulta TEXT,
            diagnostico TEXT,
            tratamiento TEXT,
            observaciones TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
        `
      })
    })

    if (historialResponse.ok) {
      console.log('✅ Tabla historial_medico creada')
    } else {
      console.log('ℹ️ Tabla historial_medico ya existe o error')
    }

    // Insertar pacientes de ejemplo
    const pacientesEjemplo = [
      {
        dni: '12345678',
        apellido: 'García',
        nombre: 'María',
        fecha_nacimiento: '1985-03-15',
        sexo: 'F',
        telefono: '011-1234-5678',
        email: 'maria.garcia@email.com',
        direccion: 'Av. Corrientes 1234',
        obra_social: 'OSDE'
      },
      {
        dni: '87654321',
        apellido: 'López',
        nombre: 'Juan',
        fecha_nacimiento: '1990-07-22',
        sexo: 'M',
        telefono: '011-8765-4321',
        email: 'juan.lopez@email.com',
        direccion: 'Av. Santa Fe 5678',
        obra_social: 'Swiss Medical'
      },
      {
        dni: '11223344',
        apellido: 'Martínez',
        nombre: 'Ana',
        fecha_nacimiento: '1978-11-08',
        sexo: 'F',
        telefono: '011-1122-3344',
        email: 'ana.martinez@email.com',
        direccion: 'Av. Córdoba 9012',
        obra_social: 'Galeno'
      }
    ]

    for (const paciente of pacientesEjemplo) {
      const insertResponse = await fetch(`${SUPABASE_URL}/rest/v1/pacientes`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paciente)
      })

      if (insertResponse.ok) {
        console.log(`✅ Paciente ${paciente.apellido}, ${paciente.nombre} insertado`)
      } else {
        const error = await insertResponse.text()
        console.log(`ℹ️ Paciente ${paciente.dni} ya existe o error:`, error)
      }
    }

    console.log('\n🎉 Tablas de pacientes creadas exitosamente!')
    console.log('📊 Puedes verificar en: http://localhost:3001/dashboard/pacientes')

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

createPatientsTables()
