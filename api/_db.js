const { Pool } = require('pg');

let pool;

function getPool() {
  if (!pool) {
    const connectionString = process.env.RAILWAY_DATABASE_URL || process.env.DATABASE_URL || "postgresql://postgres:dpgZQEHxIhZkuzNVuaXvbnPzzKYIVkMt@interchange.proxy.rlwy.net:52631/railway";
    pool = new Pool({
      connectionString,
      ssl: false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }
  return pool;
}

module.exports = {
  getPool,
  async query(text, params) {
    const p = getPool();
    return p.query(text, params);
  }
};
