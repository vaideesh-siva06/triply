import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config()

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "sys",
  connectionLimit: 10
});



export default db;
