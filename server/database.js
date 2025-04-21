const { Pool } = require('pg')

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,  // Switch the real GCP URL
});

module.exports = pool;