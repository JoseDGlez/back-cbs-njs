const mysql = require("mysql2/promise");

const requiredVariables = [
  "DB_HOST",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
];

for (const variable of requiredVariables) {
  if (!process.env[variable]) {
    throw new Error(
      `Falta configurar la variable de entorno ${variable}`
    );
  }
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  connectTimeout: 10000,
});

async function testDatabaseConnection() {
  const connection = await pool.getConnection();

  try {
    await connection.query("SELECT 1");
    console.log("Conexión a MySQL establecida correctamente.");
  } finally {
    connection.release();
  }
}

module.exports = {
  pool,
  testDatabaseConnection,
};
