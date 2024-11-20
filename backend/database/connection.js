const { Pool } = require('pg');

const pool = new Pool({
  user: 'realuser',
  host: '73.176.120.218',
  database: 'hawkmark',
  password: 'supadmin',
  port: 5432,
});

module.exports = pool;