const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: 'localhost',
  port: 3640,
  user: 'root',
  password: 'mysqltests',
  database: 'cms_db',   // Assure-toi que cette base existe
});

module.exports = pool;
