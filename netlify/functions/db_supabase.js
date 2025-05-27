// netlify/functions/db_supabase.js
// Conexión a Supabase/PostgreSQL desde Netlify Functions
const { Pool } = require('pg');

// Usa variables de entorno para mayor seguridad (recomendado en Netlify)
const connectionString = process.env.SUPABASE_CONNECTION_STRING || 'postgresql://usuario:contraseña@host:puerto/db';

console.log('DEBUG SUPABASE_CONNECTION_STRING:', connectionString);

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;
