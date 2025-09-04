const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.SUPABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function setupDatabase() {
  try {
    console.log('🔧 Configurando base de datos...');
    
    // Leer y ejecutar migraciones
    const migrationsDir = path.join(__dirname, '../migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    for (const file of migrationFiles) {
      console.log(`📦 Ejecutando migración: ${file}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      await pool.query(sql);
    }
    
    console.log('✅ Base de datos configurada correctamente');
    
    // Ejecutar seed si existe
    const seedFile = path.join(__dirname, '../seeds/initial-data.sql');
    if (fs.existsSync(seedFile)) {
      console.log('🌱 Ejecutando datos iniciales...');
      const seedSql = fs.readFileSync(seedFile, 'utf8');
      await pool.query(seedSql);
      console.log('✅ Datos iniciales cargados');
    }
    
  } catch (error) {
    console.error('❌ Error configurando base de datos:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();
