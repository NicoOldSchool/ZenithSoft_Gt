import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Error: Variables de entorno faltantes')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Definida' : 'No definida')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', serviceRoleKey ? 'Definida' : 'No definida')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

async function createTestUser() {
  try {
    console.log('Creando usuario de prueba...')
    
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@test.com',
      password: 'admin123',
      email_confirm: true,
      user_metadata: {
        nombre: 'Admin Test',
        rol: 'admin'
      }
    })

    if (error) {
      console.error('Error creando usuario:', error.message)
      return
    }

    console.log('✅ Usuario creado exitosamente!')
    console.log('📧 Email:', data.user.email)
    console.log('🆔 ID:', data.user.id)
    console.log('')
    console.log('Puedes usar estas credenciales para iniciar sesión:')
    console.log('Email: admin@test.com')
    console.log('Password: admin123')

  } catch (err) {
    console.error('Error:', err.message)
  }
}

createTestUser()
