require('dotenv').config({ path: '../../.env' }); // Adjust the path to point to the root directory
const { Client } = require('pg');

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);

const config = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

const client = new Client(config);

client.connect()
  .then(() => {
    console.log('Connected to the database successfully!');
    return client.end();
  })
  .catch(err => {
    console.error('Error connecting to the database:', err.stack);
  });