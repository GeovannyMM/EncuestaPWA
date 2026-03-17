import mysql from "mysql2/promise";

// Pool de conexiones: reutiliza conexiones en lugar de crear una nueva cada vez
const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "encuesta_alfabetismo",
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;
