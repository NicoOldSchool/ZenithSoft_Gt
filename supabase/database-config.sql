-- Configuración de Base de Datos - Sistema Médico
-- Conexión: postgresql://postgres:Zapegato_1942@db.ltuisrccawjeigwxlyqq.supabase.co:5432/postgres

-- Verificar conexión
SELECT 'Conexión exitosa a Supabase' as status;

-- Verificar extensiones disponibles
SELECT extname FROM pg_extension WHERE extname IN ('uuid-ossp', 'pgcrypto');

-- Verificar tablas existentes
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
