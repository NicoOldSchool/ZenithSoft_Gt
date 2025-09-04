@echo off
echo 🚀 Configurando Sistema Médico - Next.js + Supabase
echo ===================================================

REM Verificar Node.js
echo 🔍 Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado
    echo 📋 Descarga Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js encontrado

REM Verificar npm
echo 🔍 Verificando npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm no está instalado
    pause
    exit /b 1
)

echo ✅ npm encontrado

REM Instalar dependencias
echo.
echo 📦 Instalando dependencias...
npm install
if %errorlevel% neq 0 (
    echo ❌ Error al instalar dependencias
    pause
    exit /b 1
)

echo ✅ Dependencias instaladas

REM Crear archivo .env.local si no existe
if not exist ".env.local" (
    echo.
    echo 📝 Creando archivo .env.local...
    
    (
    echo # Supabase Configuration
    echo NEXT_PUBLIC_SUPABASE_URL=https://ltuisrccawjeigwxlyqq.supabase.co
    echo NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0dWlzcmNjYXdqZWlnd3hseXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5NDkwNzIsImV4cCI6MjA3MjUyNTA3Mn0.j69iixtWkwL70WpSHXiVoYRl1PXt4xqYfoCXzs3hbP0
    echo SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0dWlzcmNjYXdqZWlnd3hseXFxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njk0OTA3MiwiZXhwIjoyMDcyNTI1MDcyfQ.MvHvzGjScFLmflLdUwAjjBH9bkIM4M6hy23TaBFEJWA
    echo.
    echo # Next.js Configuration
    echo NEXTAUTH_URL=http://localhost:3000
    echo NEXTAUTH_SECRET=x+DyjI0wyTixIlxuHtJaXqq5YSqahZVNlD9YyWMEwjbesk91m0Gq9ZAqvpNuCNCf6qNswJ+QNDz/THAbGng+hQ==
    echo.
    echo # Development Configuration
    echo NODE_ENV=development
    ) > .env.local
    
    echo ✅ Archivo .env.local creado
) else (
    echo ✅ Archivo .env.local ya existe
)

REM Verificar Supabase CLI
echo.
echo 🔍 Verificando Supabase CLI...
supabase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Supabase CLI no está instalado
    echo 📋 Para instalar Supabase CLI:
    echo   1. npm install -g supabase
    echo   2. O usar chocolatey: choco install supabase
    echo   3. O usar winget: winget install Supabase.CLI
    echo.
    echo 💡 No es obligatorio para el funcionamiento básico
) else (
    echo ✅ Supabase CLI encontrado
)

echo.
echo 🎉 Configuración completada!
echo.
echo 📋 Próximos pasos:
echo 1. Probar conexión: npm run db:test
echo 2. Configurar base de datos: npm run db:setup
echo 3. Iniciar desarrollo: npm run dev
echo.
echo 🔗 Enlaces útiles:
echo - Supabase Dashboard: https://supabase.com/dashboard/project/ltuisrccawjeigwxlqq
echo - Documentación: docs/FASE-1-SETUP.md

pause
