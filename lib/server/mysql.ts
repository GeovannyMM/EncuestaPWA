import mysql from "mysql2/promise";

// Pool de conexiones: reutiliza conexiones en lugar de crear una nueva cada vez
const pool = mysql.createPool({
  //proceso .env lee las variables de entorno
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "encuesta_alfabetismo",
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;
