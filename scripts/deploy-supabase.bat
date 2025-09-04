@echo off
echo 🚀 Desplegando en Supabase...
echo ================================

echo 📋 Verificando Supabase CLI...
supabase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Supabase CLI no está instalado
    echo 💡 Instala desde: https://supabase.com/docs/guides/cli
    pause
    exit /b 1
)

echo ✅ Supabase CLI encontrado

echo.
echo 🔧 Configurando proyecto...
supabase link --project-ref ltuisrccawjeigwxlyqq

echo.
echo 📦 Desplegando Edge Functions...
supabase functions deploy api

echo.
echo 🗄️  Aplicando migraciones de base de datos...
supabase db push

echo.
echo 🎉 ¡Despliegue completado!
echo.
echo 📋 URLs de tu aplicación:
echo - Supabase Dashboard: https://supabase.com/dashboard/project/ltuisrccawjeigwxlyqq
echo - API Functions: https://ltuisrccawjeigwxlyqq.supabase.co/functions/v1/api
echo - Database: db.ltuisrccawjeigwxlyqq.supabase.co:5432
echo.
echo 🔗 Próximos pasos:
echo 1. Configurar variables de entorno en Supabase Dashboard
echo 2. Desplegar frontend en Vercel/Netlify
echo 3. Configurar CORS en Supabase Dashboard
echo.
pause
