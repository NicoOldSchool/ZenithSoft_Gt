#!/bin/bash

echo "🔍 Probando Conexión a Supabase"
echo "================================"

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
    exit 1
fi

echo "✅ psql encontrado"

# Probar conexión
echo "🔄 Probando conexión..."

if psql "$DB_URL" -c "SELECT 'Conexión exitosa' as status;" > /dev/null 2>&1; then
    echo "✅ Conexión exitosa a Supabase!"
    
    echo ""
    echo "📊 Información de la base de datos:"
    
    # Verificar extensiones
    echo "🔧 Extensiones disponibles:"
    psql "$DB_URL" -c "SELECT extname FROM pg_extension WHERE extname IN ('uuid-ossp', 'pgcrypto');" 2>/dev/null || echo "   No se pudieron verificar las extensiones"
    
    # Verificar tablas existentes
    echo ""
    echo "📋 Tablas existentes:"
    psql "$DB_URL" -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;" 2>/dev/null || echo "   No se pudieron verificar las tablas"
    
else
    echo "❌ Error de conexión"
    echo "💡 Verifica:"
    echo "   - Que la contraseña sea correcta"
    echo "   - Que el proyecto Supabase esté activo"
    echo "   - Que no haya problemas de red"
    echo ""
    echo "🔗 Supabase Dashboard: https://supabase.com/dashboard/project/ltuisrccawjeigwxlqq"
fi

echo ""
echo "📋 Próximos pasos:"
echo "1. Si la conexión es exitosa: npm run db:setup"
echo "2. Si hay errores: Usar Supabase Dashboard"
echo "3. Probar aplicación: npm run dev"
