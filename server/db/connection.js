const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST, // Usually 'localhost' when using Cloud SQL Auth Proxy
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false // Optional, depends on your Cloud SQL SSL settings
  }
});

module.exports = pool;
