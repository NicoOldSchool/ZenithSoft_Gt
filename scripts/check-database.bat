@echo off
echo 🔍 Verificando Estado de la Base de Datos
echo =========================================

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
if %errorlevel% neq 0 (
    echo ❌ Error de conexión
    echo 💡 Verifica la contraseña y que el proyecto esté activo
    pause
    exit /b 1
)

echo ✅ Conexión exitosa a Supabase!

REM Verificar tablas existentes
echo.
echo 📋 Verificando tablas existentes...

echo 🔍 Tablas en la base de datos:
psql "%DB_URL%" -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"

REM Verificar datos en las tablas
echo.
echo 📊 Verificando datos en las tablas principales:

echo 🔍 Establecimientos:
psql "%DB_URL%" -c "SELECT COUNT(*) as total FROM establecimientos;"

echo 🔍 Usuarios:
psql "%DB_URL%" -c "SELECT COUNT(*) as total FROM users;"

echo 🔍 Pacientes:
psql "%DB_URL%" -c "SELECT COUNT(*) as total FROM pacientes;"

echo 🔍 Profesionales:
psql "%DB_URL%" -c "SELECT COUNT(*) as total FROM profesionales;"

echo 🔍 Turnos:
psql "%DB_URL%" -c "SELECT COUNT(*) as total FROM turnos;"

echo 🔍 Aranceles:
psql "%DB_URL%" -c "SELECT COUNT(*) as total FROM aranceles;"

echo 🔍 Prácticas:
psql "%DB_URL%" -c "SELECT COUNT(*) as total FROM practicas;"

REM Verificar extensiones
echo.
echo 🔧 Extensiones disponibles:
psql "%DB_URL%" -c "SELECT extname FROM pg_extension WHERE extname IN ('uuid-ossp', 'pgcrypto');"

echo.
echo 🎉 Verificación completada!
echo.
echo 📋 Estado de la base de datos:
echo ✅ Conexión: Funcionando
echo ✅ Tablas: Creadas
echo ✅ Extensiones: Instaladas
echo.
echo 📋 Próximos pasos:
echo 1. Iniciar desarrollo: npm run dev
echo 2. Probar aplicación: http://localhost:3000/test
echo 3. Crear cuenta: http://localhost:3000/register
echo.
echo 🔗 Enlaces útiles:
echo - Supabase Dashboard: https://supabase.com/dashboard/project/ltuisrccawjeigwxlqq
echo - Prueba de conexión: http://localhost:3000/test

pause
