# 🚀 Guía de Inicio Rápido - Sistema Médico

## ⚡ Configuración en 5 minutos

### 1. Configurar el Proyecto
```bash
# Configuración automática con tus credenciales
npm run configure
```

### 2. Probar Conexión a la Base de Datos
```bash
# Probar conexión directa a PostgreSQL
npm run db:test
```

### 3. Configurar Base de Datos (Opción A - Automática)
```bash
# Si tienes psql instalado
npm run db:setup
```

### 4. Configurar Base de Datos (Opción B - Manual)
1. Ir a [Supabase Dashboard](https://supabase.com/dashboard/project/ltuisrccawjeigwxlqq)
2. SQL Editor → Ejecutar `supabase/migrations/001_initial_schema.sql`
3. SQL Editor → Ejecutar `supabase/seed.sql`

### 5. Iniciar Desarrollo
```bash
npm run dev
```

### 6. Probar la Aplicación
- **Prueba de conexión**: http://localhost:3000/test
- **Registro**: http://localhost:3000/register
- **Login**: http://localhost:3000/login

## 🔧 Información de Conexión

### Supabase
- **URL**: https://ltuisrccawjeigwxlqq.supabase.co
- **Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0dWlzcmNjYXdqZWlnd3hseXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5NDkwNzIsImV4cCI6MjA3MjUyNTA3Mn0.j69iixtWkwL70WpSHXiVoYRl1PXt4xqYfoCXzs3hbP0
- **Service Role Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0dWlzcmNjYXdqZWlnd3hseXFxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njk0OTA3MiwiZXhwIjoyMDcyNTI1MDcyfQ.MvHvzGjScFLmflLdUwAjjBH9bkIM4M6hy23TaBFEJWA

### PostgreSQL Directo
- **Host**: db.ltuisrccawjeigwxlyqq.supabase.co
- **Puerto**: 5432
- **Base de datos**: postgres
- **Usuario**: postgres
- **Contraseña**: Zapegato_1942
- **URL de conexión**: postgresql://postgres:Zapegato_1942@db.ltuisrccawjeigwxlyqq.supabase.co:5432/postgres

## 📋 Scripts Disponibles

```bash
npm run configure    # Configuración automática
npm run db:test       # Probar conexión a la BD
npm run db:setup      # Configurar BD automáticamente
npm run db:check      # Verificar estado de la BD
npm run dev           # Iniciar desarrollo
npm run build         # Build para producción
npm run lint          # Linting
```

## 🐛 Solución de Problemas

### Error: "psql no está instalado"
```bash
# Ubuntu/Debian
sudo apt-get install postgresql-client

# macOS
brew install postgresql

# Windows
# Opción 1: Descargar desde https://www.postgresql.org/download/windows/
# Opción 2: Usar chocolatey: choco install postgresql
# Opción 3: Usar winget: winget install PostgreSQL.PostgreSQL
```

### Error: "Invalid API key"
- Verificar que las variables de entorno estén correctas
- Verificar que el proyecto Supabase esté activo

### Error: "Connection refused"
- Verificar que el proyecto Supabase esté activo
- Verificar la contraseña de la base de datos

## 🔗 Enlaces Útiles

- **Supabase Dashboard**: https://supabase.com/dashboard/project/ltuisrccawjeigwxlqq
- **Documentación completa**: docs/FASE-1-SETUP.md
- **Prueba de conexión**: http://localhost:3000/test

## 🎯 Próximos Pasos

1. ✅ Configurar proyecto
2. ✅ Probar conexión
3. ✅ Configurar base de datos
4. ✅ Iniciar desarrollo
5. ✅ Probar aplicación
6. 🔄 Implementar dashboard completo (Fase 2)
