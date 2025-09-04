#!/bin/bash

echo "🚀 Configurando Sistema Médico - Next.js + Supabase"
echo "=================================================="

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 18+"
    exit 1
fi

# Verificar que npm esté instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado. Por favor instala npm"
    exit 1
fi

echo "✅ Node.js y npm verificados"

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Crear archivo .env.local si no existe
if [ ! -f .env.local ]; then
    echo "🔧 Creando archivo .env.local..."
    cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
EOF
    echo "✅ Archivo .env.local creado"
    echo "⚠️  IMPORTANTE: Edita .env.local con tus credenciales de Supabase"
else
    echo "✅ Archivo .env.local ya existe"
fi

# Verificar que Supabase CLI esté instalado
if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI no está instalado"
    echo "📋 Para instalar Supabase CLI:"
    echo "   npm install -g supabase"
    echo "   o visita: https://supabase.com/docs/guides/cli"
else
    echo "✅ Supabase CLI verificado"
fi

echo ""
echo "🎉 Setup completado!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Crea un proyecto en https://supabase.com"
echo "2. Copia las credenciales a .env.local"
echo "3. Ejecuta las migraciones: supabase db push"
echo "4. Inicia el servidor: npm run dev"
echo ""
echo "🔗 Enlaces útiles:"
echo "- Supabase Dashboard: https://supabase.com/dashboard"
echo "- Documentación Next.js: https://nextjs.org/docs"
echo "- Documentación Supabase: https://supabase.com/docs"
