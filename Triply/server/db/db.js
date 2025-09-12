import mysql from 'mysql2';

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "sys",
  connectionLimit: 10
});



export default db;
