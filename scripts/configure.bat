@echo off
echo 🔧 Configurando Sistema Médico con tus credenciales de Supabase
echo ===============================================================

REM Crear archivo .env.local
echo Creando archivo .env.local...

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

echo ✅ Archivo .env.local creado con tus credenciales

REM Verificar si node_modules existe
if not exist "node_modules" (
    echo.
    echo 📦 Instalando dependencias...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Error al instalar dependencias
        pause
        exit /b 1
    )
    echo ✅ Dependencias instaladas
) else (
    echo ✅ Dependencias ya instaladas
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
