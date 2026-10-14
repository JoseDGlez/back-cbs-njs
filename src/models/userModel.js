const { pool } = require("../config/database");

async function findUserByUsername(username) {
  const sql = `
    SELECT
      id,
      username,
      email,
      password_hash,
      is_active,
      created_at
    FROM users
    WHERE username = ?
    LIMIT 1
  `;

  const [rows] = await pool.execute(sql, [username]);

  return rows[0] || null;
}

module.exports = {
  findUserByUsername,
};
