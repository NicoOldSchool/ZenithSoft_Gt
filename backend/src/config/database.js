import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.SUPABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // máximo número de conexiones en el pool
  idleTimeoutMillis: 30000, // tiempo máximo que una conexión puede estar inactiva
  connectionTimeoutMillis: 2000, // tiempo máximo para establecer una conexión
});

// Evento cuando se conecta un cliente
pool.on('connect', (client) => {
  console.log('🔌 Nueva conexión a la base de datos establecida');
});

// Evento cuando se libera un cliente
pool.on('remove', (client) => {
  console.log('🔌 Cliente liberado del pool de conexiones');
});

// Evento de error
pool.on('error', (err, client) => {
  console.error('❌ Error inesperado en el pool de conexiones:', err);
});

// Función para probar la conexión
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Conexión a la base de datos exitosa:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
    return false;
  }
};

// Función para cerrar el pool
export const closePool = async () => {
  await pool.end();
  console.log('🔌 Pool de conexiones cerrado');
};

export default pool;
