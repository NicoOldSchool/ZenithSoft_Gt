// Script para insertar pacientes de ejemplo
const SUPABASE_URL = 'https://ltuisrccawjeigwxlyqq.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0dWlzcmNjYXdqZWlnd3hseXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5NDkwNzIsImV4cCI6MjA3MjUyNTA3Mn0.j69iixtWkwL70WpSHXiVoYRl1PXt4xqYfoCXzs3hbP0'

const pacientesEjemplo = [
  {
    dni: '12345678',
    apellido: 'García',
    nombre: 'María',
    fecha_nacimiento: '1985-03-15',
    sexo: 'F',
    telefono: '011-1234-5678',
    email: 'maria.garcia@email.com',
    direccion: 'Av. Corrientes 1234, CABA',
    obra_social: 'OSDE',
    numero_afiliado: 'OSDE-123456',
    observaciones: 'Paciente con hipertensión controlada',
    activo: true
  },
  {
    dni: '87654321',
    apellido: 'López',
    nombre: 'Juan',
    fecha_nacimiento: '1990-07-22',
    sexo: 'M',
    telefono: '011-8765-4321',
    email: 'juan.lopez@email.com',
    direccion: 'Av. Santa Fe 5678, CABA',
    obra_social: 'Swiss Medical',
    numero_afiliado: 'SM-789012',
    observaciones: 'Alergia a la penicilina',
    activo: true
  },
  {
    dni: '11223344',
    apellido: 'Martínez',
    nombre: 'Ana',
    fecha_nacimiento: '1978-11-08',
    sexo: 'F',
    telefono: '011-1122-3344',
    email: 'ana.martinez@email.com',
    direccion: 'Av. Córdoba 9012, CABA',
    obra_social: 'Galeno',
    numero_afiliado: 'GAL-345678',
    observaciones: 'Diabetes tipo 2',
    activo: true
  },
  {
    dni: '55667788',
    apellido: 'Rodríguez',
    nombre: 'Carlos',
    fecha_nacimiento: '1992-05-30',
    sexo: 'M',
    telefono: '011-5566-7788',
    email: 'carlos.rodriguez@email.com',
    direccion: 'Av. Rivadavia 3456, CABA',
    obra_social: 'Medicus',
    numero_afiliado: 'MED-901234',
    observaciones: 'Paciente sano',
    activo: true
  },
  {
    dni: '99887766',
    apellido: 'Fernández',
    nombre: 'Laura',
    fecha_nacimiento: '1987-09-12',
    sexo: 'F',
    telefono: '011-9988-7766',
    email: 'laura.fernandez@email.com',
    direccion: 'Av. Callao 7890, CABA',
    obra_social: 'OSDE',
    numero_afiliado: 'OSDE-567890',
    observaciones: 'Embarazo de 6 meses',
    activo: true
  }
]

async function insertSamplePatients() {
  console.log('🏥 Insertando pacientes de ejemplo...')
  
  for (const paciente of pacientesEjemplo) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/pacientes`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paciente)
      })

      if (response.ok) {
        console.log(`✅ Paciente ${paciente.apellido}, ${paciente.nombre} insertado`)
      } else {
        const error = await response.text()
        console.log(`ℹ️ Paciente ${paciente.dni} ya existe o error:`, error)
      }
    } catch (error) {
      console.error(`❌ Error insertando ${paciente.dni}:`, error.message)
    }
  }

  console.log('\n🎉 Proceso completado!')
  console.log('📊 Ve a: http://localhost:3001/dashboard/pacientes')
}

insertSamplePatients()
