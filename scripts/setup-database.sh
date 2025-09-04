#!/bin/bash

echo "🗄️  Configurando Base de Datos - Sistema Médico"
echo "================================================"

# Variables de conexión
DB_URL="postgresql://postgres:Zapegato_1942@db.ltuisrccawjeigwxlyqq.supabase.co:5432/postgres"

echo "📋 Información de conexión:"
echo "Host: db.ltuisrccawjeigwxlyqq.supabase.co"
echo "Puerto: 5432"
echo "Base de datos: postgres"
echo "Usuario: postgres"
echo ""

# Verificar si psql está instalado
if ! command -v psql &> /dev/null; then
    echo "❌ psql no está instalado"
    echo "📋 Para instalar PostgreSQL client:"
    echo "   Ubuntu/Debian: sudo apt-get install postgresql-client"
    echo "   macOS: brew install postgresql"
    echo "   Windows: Descargar desde https://www.postgresql.org/download/windows/"
    echo ""
    echo "🔗 Alternativa: Usar Supabase Dashboard"
    echo "   1. Ir a https://supabase.com/dashboard/project/ltuisrccawjeigwxlqq"
    echo "   2. SQL Editor"
    echo "   3. Ejecutar supabase/migrations/001_initial_schema.sql"
    echo "   4. Ejecutar supabase/seed.sql"
    exit 1
fi

echo "✅ psql encontrado"

# Función para ejecutar SQL
execute_sql() {
    local sql_file=$1
    local description=$2
    
    echo "🔄 $description..."
    
    if psql "$DB_URL" -f "$sql_file" > /dev/null 2>&1; then
        echo "✅ $description completado"
    else
        echo "❌ Error al ejecutar $description"
        echo "💡 Intenta ejecutar manualmente en Supabase Dashboard"
        return 1
    fi
}

# Ejecutar migraciones
echo ""
echo "📊 Ejecutando migraciones..."

if [ -f "supabase/migrations/001_initial_schema.sql" ]; then
    execute_sql "supabase/migrations/001_initial_schema.sql" "Migración inicial"
else
    echo "❌ Archivo de migración no encontrado"
    echo "💡 Verifica que el archivo supabase/migrations/001_initial_schema.sql existe"
fi

# Ejecutar seed data
echo ""
echo "🌱 Insertando datos de ejemplo..."

if [ -f "supabase/seed.sql" ]; then
    execute_sql "supabase/seed.sql" "Datos de ejemplo"
else
    echo "❌ Archivo de seed no encontrado"
    echo "💡 Verifica que el archivo supabase/seed.sql existe"
fi

echo ""
echo "🎉 Configuración de base de datos completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Ejecutar: npm run dev"
echo "2. Ir a: http://localhost:3000/test"
echo "3. Probar conexión con Supabase"
echo "4. Crear cuenta en: http://localhost:3000/register"
echo ""
echo "🔗 Enlaces útiles:"
echo "- Supabase Dashboard: https://supabase.com/dashboard/project/ltuisrccawjeigwxlqq"
echo "- Prueba de conexión: http://localhost:3000/test"
