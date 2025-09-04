# Fase 1: Setup - Sistema Médico Next.js + Supabase

## 🎯 Objetivos de la Fase 1

- ✅ Crear proyecto en Supabase
- ✅ Configurar Next.js con @supabase/auth-helpers-nextjs
- ✅ Implementar login/registro con roles y grupos
- ✅ Configurar aislamiento de datos por establecimiento

## 🚀 Pasos para Configurar el Proyecto

### 1. Crear Proyecto en Supabase

1. **Ir a [Supabase](https://supabase.com)**
2. **Crear cuenta** (si no tienes una)
3. **Crear nuevo proyecto**:
   - Nombre: `sistema-medico`
   - Contraseña de base de datos: `tu-contraseña-segura`
   - Región: La más cercana a tu ubicación

### 2. Configurar Variables de Entorno

**Opción A: Configuración Automática**
```bash
npm run configure
```

**Opción B: Configuración Manual**
Crear archivo `.env.local` en la raíz del proyecto:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ltuisrccawjeigwxlqq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0dWlzcmNjYXdqZWlnd3hseXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5NDkwNzIsImV4cCI6MjA3MjUyNTA3Mn0.j69iixtWkwL70WpSHXiVoYRl1PXt4xqYfoCXzs3hbP0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0dWlzcmNjYXdqZWlnd3hseXFxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njk0OTA3MiwiZXhwIjoyMDcyNTI1MDcyfQ.MvHvzGjScFLmflLdUwAjjBH9bkIM4M6hy23TaBFEJWA

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=x+DyjI0wyTixIlxuHtJaXqq5YSqahZVNlD9YyWMEwjbesk91m0Gq9ZAqvpNuCNCf6qNswJ+QNDz/THAbGng+hQ==

# Development Configuration
NODE_ENV=development
```

### 3. Ejecutar Migraciones de Base de Datos

1. **Instalar Supabase CLI** (opcional):
   ```bash
   npm install -g supabase
   ```

2. **Ejecutar migraciones**:
   - Ir al SQL Editor en Supabase Dashboard
   - Copiar y ejecutar el contenido de `supabase/migrations/001_initial_schema.sql`

3. **Insertar datos de ejemplo**:
   - Copiar y ejecutar el contenido de `supabase/seed.sql`

### 4. Instalar Dependencias y Ejecutar

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

## 🔧 Configuración de Autenticación

### Estructura de Usuarios

```sql
-- Tabla users (extendiendo auth.users)
users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  nombre TEXT,
  email TEXT UNIQUE NOT NULL,
  rol TEXT CHECK (rol IN ('admin', 'recepcionista', 'profesional', 'lectura')),
  establecimiento_id UUID REFERENCES establecimientos(id) ON DELETE CASCADE
)
```

### Roles y Permisos

1. **Admin**: Acceso completo al sistema
2. **Recepcionista**: Gestión de pacientes y turnos
3. **Profesional**: Ver turnos asignados
4. **Lectura**: Solo consultas

### Aislamiento por Establecimiento

- Cada usuario pertenece a un establecimiento
- Los datos están aislados por `establecimiento_id`
- Row Level Security (RLS) garantiza la separación

## 📁 Estructura de Archivos Creados

```
├── app/
│   ├── login/page.tsx          # Página de login
│   ├── register/page.tsx       # Página de registro
│   └── dashboard/              # Páginas protegidas
├── components/
│   ├── providers.tsx           # Providers de React Query y Supabase
│   └── auth/                   # Componentes de autenticación
├── hooks/
│   └── useAuth.ts              # Hook personalizado para auth
├── middleware.ts               # Middleware de autenticación
├── supabase/
│   ├── migrations/             # Migraciones de base de datos
│   └── seed.sql               # Datos de ejemplo
└── scripts/
    └── setup.sh               # Script de configuración
```

## 🔐 Seguridad Implementada

### Row Level Security (RLS)

```sql
-- Política para pacientes (usuarios del mismo establecimiento)
CREATE POLICY "Pacientes por establecimiento" ON pacientes
  FOR ALL USING (
    establecimiento_id IN (
      SELECT establecimiento_id FROM users WHERE users.id = auth.uid()
    )
  );
```

### Middleware de Autenticación

- Protege rutas `/dashboard/*`
- Redirige usuarios no autenticados a `/login`
- Redirige usuarios autenticados desde `/login` a `/dashboard`

## 🧪 Testing de la Configuración

### 1. Probar Conexión

1. Ir a `http://localhost:3000/test`
2. Hacer clic en "Probar Conexión"
3. Verificar que la conexión sea exitosa
4. Hacer clic en "Probar Auth" para verificar autenticación

### 2. Probar Registro

1. Ir a `http://localhost:3000/register`
2. Completar formulario de registro
3. Verificar que se crea el usuario y establecimiento
4. Confirmar email (si está habilitado)

### 3. Probar Login

1. Ir a `http://localhost:3000/login`
2. Iniciar sesión con credenciales creadas
3. Verificar redirección a dashboard
4. Verificar que se muestran los datos del usuario

### 4. Probar Aislamiento

1. Crear dos usuarios en diferentes establecimientos
2. Verificar que cada usuario solo ve sus datos
3. Verificar que no pueden acceder a datos de otros establecimientos

## 🐛 Solución de Problemas Comunes

### Error: "Invalid API key"

- Verificar que las variables de entorno estén correctas
- Verificar que el proyecto Supabase esté activo

### Error: "Row Level Security"

- Verificar que las políticas RLS estén ejecutadas
- Verificar que el usuario tenga `establecimiento_id` asignado

### Error: "User not found"

- Verificar que el usuario exista en la tabla `users`
- Verificar que el `id` coincida con `auth.uid()`

## 📋 Checklist de Verificación

- [ ] Proyecto Supabase creado
- [ ] Variables de entorno configuradas
- [ ] Migraciones ejecutadas
- [ ] Datos de ejemplo insertados
- [ ] Aplicación ejecutándose en `localhost:3000`
- [ ] Registro de usuarios funcionando
- [ ] Login funcionando
- [ ] Redirecciones funcionando
- [ ] Aislamiento de datos funcionando
- [ ] Roles y permisos funcionando

## 🎯 Próximos Pasos (Fase 2)

- Implementar páginas del dashboard
- Crear formularios de gestión
- Implementar CRUD de entidades
- Agregar validaciones y manejo de errores
- Implementar búsqueda y filtros

## 📚 Recursos Adicionales

- [Documentación Supabase](https://supabase.com/docs)
- [Documentación Next.js](https://nextjs.org/docs)
- [Guía de Autenticación Supabase](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
