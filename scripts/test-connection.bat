@echo off
echo 🔍 Probando Conexión a Supabase
echo ================================

REM Variables de conexión
set DB_URL=postgresql://postgres:Zapegato_1942@db.ltuisrccawjeigwxlyqq.supabase.co:5432/postgres

echo 📋 Información de conexión:
echo Host: db.ltuisrccawjeigwxlyqq.supabase.co
echo Puerto: 5432
echo Base de datos: postgres
echo Usuario: postgres
echo.

REM Verificar si psql está instalado
where psql >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ psql no está instalado
    echo 📋 Para instalar PostgreSQL client:
    echo   1. Descargar desde https://www.postgresql.org/download/windows/
    echo   2. O usar chocolatey: choco install postgresql
    echo   3. O usar winget: winget install PostgreSQL.PostgreSQL
    pause
    exit /b 1
)

echo ✅ psql encontrado

REM Probar conexión
echo 🔄 Probando conexión...

psql "%DB_URL%" -c "SELECT 'Conexión exitosa' as status;" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Conexión exitosa a Supabase!
    
    echo.
    echo 📊 Información de la base de datos:
    
    REM Verificar extensiones
    echo 🔧 Extensiones disponibles:
    psql "%DB_URL%" -c "SELECT extname FROM pg_extension WHERE extname IN ('uuid-ossp', 'pgcrypto');" 2>nul || echo    No se pudieron verificar las extensiones
    
    REM Verificar tablas existentes
    echo.
    echo 📋 Tablas existentes:
    psql "%DB_URL%" -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;" 2>nul || echo    No se pudieron verificar las tablas
    
) else (
    echo ❌ Error de conexión
    echo 💡 Verifica:
    echo    - Que la contraseña sea correcta
    echo    - Que el proyecto Supabase esté activo
    echo    - Que no haya problemas de red
    echo.
    echo 🔗 Supabase Dashboard: https://supabase.com/dashboard/project/ltuisrccawjeigwxlqq
)

echo.
echo 📋 Próximos pasos:
echo 1. Si la conexión es exitosa: npm run db:setup
echo 2. Si hay errores: Usar Supabase Dashboard
echo 3. Probar aplicación: npm run dev

pause
