const { Pool } = require('pg');
const { DATABASE_URL } = require('../utils/config');

let pool;
let hasWarned = false;

if (DATABASE_URL) {
  console.log(`[db] Attempting to connect using DATABASE_URL: ${DATABASE_URL}`);
  pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false },
  });

  pool.on('connect', () => {
    console.log('[db] Connection to PostgreSQL established.');
  });

  pool.on('error', (error) => {
    console.error('[db] Unexpected PostgreSQL pool error:', error);
  });
} else {
  console.warn('[db] DATABASE_URL is not set; trip logs will be skipped.');
}

const isConnected = () => Boolean(pool);

const query = (text, params) => {
  if (!pool) {
    if (!hasWarned) {
      console.warn('[db] Query requested but no database pool is configured.');
      hasWarned = true;
    }
    return Promise.resolve({ rows: [] });
  }
  console.log('[db] Executing query:', text.trim().split('\n').join(' '));
  return pool.query(text, params);
};

module.exports = {
  query,
  isConnected,
};
