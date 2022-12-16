const mysql = require('mysql2');

const cDB = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'etApp_db'
  };

  const etDB = mysql.createConnection(cDB);

  module.exports = etDB;