const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Set this in your .env file
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  connect: () => pool.connect(),
};