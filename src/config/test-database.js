require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

const { testDatabaseConnection, pool } = require("./database");

async function main() {
  try {
    await testDatabaseConnection();

    const [rows] = await pool.query(
      "SELECT DATABASE() AS database_name, COUNT(*) AS total_users FROM users"
    );

    console.log("Base de datos:", rows[0].database_name);
    console.log("Usuarios registrados:", rows[0].total_users);
  } catch (error) {
    console.error("No se pudo verificar MySQL:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
