@echo off
echo 🗄️  Configurando Base de Datos - Sistema Médico
echo ================================================

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
    echo.
    echo 🔗 Alternativa: Usar Supabase Dashboard
    echo   1. Ir a https://supabase.com/dashboard/project/ltuisrccawjeigwxlqq
    echo   2. SQL Editor
    echo   3. Ejecutar supabase/migrations/001_initial_schema.sql
    echo   4. Ejecutar supabase/seed.sql
    pause
    exit /b 1
)

echo ✅ psql encontrado

REM Función para ejecutar SQL
:execute_sql
set sql_file=%~1
set description=%~2

echo 🔄 %description%...

psql "%DB_URL%" -f "%sql_file%" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ %description% completado
) else (
    echo ⚠️  Posible error al ejecutar %description%
    echo 💡 Las tablas pueden ya existir (esto es normal)
    echo 🔍 Verificando estado actual...
    goto :check_status
)

REM Ejecutar migraciones
echo.
echo 📊 Ejecutando migraciones...

if exist "supabase\migrations\001_initial_schema.sql" (
    call :execute_sql "supabase\migrations\001_initial_schema.sql" "Migración inicial"
) else (
    echo ❌ Archivo de migración no encontrado
    echo 💡 Verifica que el archivo supabase\migrations\001_initial_schema.sql existe
)

REM Ejecutar seed data
echo.
echo 🌱 Insertando datos de ejemplo...

if exist "supabase\seed.sql" (
    call :execute_sql "supabase\seed.sql" "Datos de ejemplo"
) else (
    echo ❌ Archivo de seed no encontrado
    echo 💡 Verifica que el archivo supabase\seed.sql existe
)

echo.
echo 🎉 Configuración de base de datos completada!
echo.
echo 📋 Próximos pasos:
echo 1. Ejecutar: npm run dev
echo 2. Ir a: http://localhost:3000/test
echo 3. Probar conexión con Supabase
echo 4. Crear cuenta en: http://localhost:3000/register
echo.
echo 🔗 Enlaces útiles:
echo - Supabase Dashboard: https://supabase.com/dashboard/project/ltuisrccawjeigwxlqq
echo - Prueba de conexión: http://localhost:3000/test

pause
goto :eof

REM Función para verificar estado
:check_status
echo.
echo 🔍 Verificando estado actual de la base de datos...

echo 📋 Tablas existentes:
psql "%DB_URL%" -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;" 2>nul

echo.
echo 📊 Datos en las tablas principales:
echo 🔍 Establecimientos:
psql "%DB_URL%" -c "SELECT COUNT(*) as total FROM establecimientos;" 2>nul

echo 🔍 Usuarios:
psql "%DB_URL%" -c "SELECT COUNT(*) as total FROM users;" 2>nul

echo.
echo ✅ Base de datos está configurada y lista para usar!
echo.
echo 📋 Próximos pasos:
echo 1. Ejecutar: npm run dev
echo 2. Ir a: http://localhost:3000/test
echo 3. Probar conexión con Supabase
echo 4. Crear cuenta en: http://localhost:3000/register
echo.
echo 🔗 Enlaces útiles:
echo - Supabase Dashboard: https://supabase.com/dashboard/project/ltuisrccawjeigwxlqq
echo - Prueba de conexión: http://localhost:3000/test

pause
