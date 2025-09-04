@echo off
echo 🔧 Corrigiendo archivo .env.local
echo ================================

echo 📝 Creando archivo .env.local con la URL correcta...

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

echo ✅ Archivo .env.local creado con la URL correcta
echo.
echo 📋 Información de configuración:
echo URL: https://ltuisrccawjeigwxlyqq.supabase.co
echo Host: db.ltuisrccawjeigwxlyqq.supabase.co:5432
echo.
echo 🔄 Reiniciando el servidor de desarrollo...
echo.
echo 📋 Próximos pasos:
echo 1. Detener el servidor actual (Ctrl+C)
echo 2. Ejecutar: npm run dev
echo 3. Probar: http://localhost:3000/test
echo.
echo 🔗 Enlaces útiles:
echo - Supabase Dashboard: https://supabase.com/dashboard/project/ltuisrccawjeigwxlyqq
echo - Prueba de conexión: http://localhost:3000/test

pause
