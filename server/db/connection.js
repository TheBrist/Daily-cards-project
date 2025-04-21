const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "daily_dashboard",
  password: "postgres",
  port: 5432,
});

module.exports = pool;