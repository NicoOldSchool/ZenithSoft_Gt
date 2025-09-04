# 🪟 Configuración en Windows - Sistema Médico

## ⚡ Configuración Rápida para Windows

### 1. Configurar el Proyecto
```cmd
# Configuración automática con tus credenciales
npm run configure
```

### 2. Probar Conexión a la Base de Datos
```cmd
# Probar conexión directa a PostgreSQL
npm run db:test
```

### 3. Configurar Base de Datos (Opción A - Automática)
```cmd
# Si tienes psql instalado
npm run db:setup
```

### 4. Configurar Base de Datos (Opción B - Manual)
1. Ir a [Supabase Dashboard](https://supabase.com/dashboard/project/ltuisrccawjeigwxlqq)
2. SQL Editor → Ejecutar `supabase/migrations/001_initial_schema.sql`
3. SQL Editor → Ejecutar `supabase/seed.sql`

### 5. Iniciar Desarrollo
```cmd
npm run dev
```

### 6. Probar la Aplicación
- **Prueba de conexión**: http://localhost:3000/test
- **Registro**: http://localhost:3000/register
- **Login**: http://localhost:3000/login

## 🔧 Instalación de Prerrequisitos en Windows

### Node.js
1. Descargar desde [nodejs.org](https://nodejs.org/)
2. O usar chocolatey: `choco install nodejs`
3. O usar winget: `winget install OpenJS.NodeJS`

### PostgreSQL Client (psql)
1. **Opción 1**: Descargar desde [postgresql.org](https://www.postgresql.org/download/windows/)
2. **Opción 2**: Usar chocolatey: `choco install postgresql`
3. **Opción 3**: Usar winget: `winget install PostgreSQL.PostgreSQL`

### Supabase CLI (Opcional)
1. **Opción 1**: `npm install -g supabase`
2. **Opción 2**: Usar chocolatey: `choco install supabase`
3. **Opción 3**: Usar winget: `winget install Supabase.CLI`

## 🐛 Solución de Problemas en Windows

### Error: "chmod no se reconoce"
- Los scripts están configurados para detectar automáticamente Windows
- Usa los comandos npm directamente: `npm run configure`

### Error: "psql no está instalado"
```cmd
# Verificar si psql está en el PATH
where psql

# Si no está, agregar PostgreSQL al PATH
# Buscar en: C:\Program Files\PostgreSQL\[version]\bin
```

### Error: "Permission denied"
```cmd
# Ejecutar PowerShell como Administrador
# O usar: npm run configure --no-scripts
```

### Error: "Scripts no se ejecutan"
```cmd
# Verificar política de ejecución
Get-ExecutionPolicy

# Cambiar política (como administrador)
Set-ExecutionPolicy RemoteSigned
```

## 📋 Scripts Disponibles en Windows

```cmd
npm run configure    # Configuración automática
npm run db:test       # Probar conexión a la BD
npm run db:setup      # Configurar BD automáticamente
npm run db:check      # Verificar estado de la BD
npm run dev           # Iniciar desarrollo
npm run build         # Build para producción
npm run lint          # Linting
```

## 🔗 Enlaces Útiles

- **Supabase Dashboard**: https://supabase.com/dashboard/project/ltuisrccawjeigwxlqq
- **Documentación completa**: docs/FASE-1-SETUP.md
- **Prueba de conexión**: http://localhost:3000/test
- **Node.js para Windows**: https://nodejs.org/
- **PostgreSQL para Windows**: https://www.postgresql.org/download/windows/

## 🎯 Próximos Pasos

1. ✅ Configurar proyecto
2. ✅ Probar conexión
3. ✅ Configurar base de datos
4. ✅ Iniciar desarrollo
5. ✅ Probar aplicación
6. 🔄 Implementar dashboard completo (Fase 2)
