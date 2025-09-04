@echo off
echo 🚀 Desplegando en Vercel...
echo ================================

echo 📋 Verificando Vercel CLI...
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI no está instalado
    echo 💡 Instala con: npm i -g vercel
    pause
    exit /b 1
)

echo ✅ Vercel CLI encontrado

echo.
echo 🔧 Configurando variables de entorno...
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

echo.
echo 📦 Desplegando aplicación...
vercel --prod

echo.
echo 🎉 ¡Despliegue completado!
echo.
echo 📋 URLs de tu aplicación:
echo - Frontend: https://tu-app.vercel.app
echo - Supabase Dashboard: https://supabase.com/dashboard/project/ltuisrccawjeigwxlyqq
echo.
echo 🔗 Próximos pasos:
echo 1. Configurar dominio personalizado (opcional)
echo 2. Configurar webhooks en Supabase
echo 3. Configurar variables de entorno en Vercel Dashboard
echo.
pause
