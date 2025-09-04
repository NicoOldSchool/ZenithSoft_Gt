#!/bin/bash

echo "🔧 Configurando Sistema Médico con tus credenciales de Supabase"
echo "================================================================"

# Crear .env.local con las credenciales
echo "📝 Creando archivo .env.local..."
cat > .env.local << 'EOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ltuisrccawjeigwxlqq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0dWlzcmNjYXdqZWlnd3hseXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5NDkwNzIsImV4cCI6MjA3MjUyNTA3Mn0.j69iixtWkwL70WpSHXiVoYRl1PXt4xqYfoCXzs3hbP0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0dWlzcmNjYXdqZWlnd3hseXFxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njk0OTA3MiwiZXhwIjoyMDcyNTI1MDcyfQ.MvHvzGjScFLmflLdUwAjjBH9bkIM4M6hy23TaBFEJWA

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=x+DyjI0wyTixIlxuHtJaXqq5YSqahZVNlD9YyWMEwjbesk91m0Gq9ZAqvpNuCNCf6qNswJ+QNDz/THAbGng+hQ==

# Development Configuration
NODE_ENV=development
EOF

echo "✅ Archivo .env.local creado con tus credenciales"

# Instalar dependencias si no están instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
else
    echo "✅ Dependencias ya instaladas"
fi

echo ""
echo "🎉 Configuración completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Ejecutar migraciones en Supabase Dashboard:"
echo "   - Ir a https://supabase.com/dashboard/project/ltuisrccawjeigwxlqq"
echo "   - SQL Editor → Ejecutar supabase/migrations/001_initial_schema.sql"
echo "   - SQL Editor → Ejecutar supabase/seed.sql"
echo ""
echo "2. Iniciar el servidor de desarrollo:"
echo "   npm run dev"
echo ""
echo "3. Probar la aplicación:"
echo "   - http://localhost:3000/register (crear cuenta)"
echo "   - http://localhost:3000/login (iniciar sesión)"
echo ""
echo "🔗 Enlaces útiles:"
echo "- Supabase Dashboard: https://supabase.com/dashboard/project/ltuisrccawjeigwxlqq"
echo "- Documentación: docs/FASE-1-SETUP.md"
