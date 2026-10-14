const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { findUserByUsername } = require("../models/userModel");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

if (!JWT_SECRET_KEY) {
  throw new Error("Falta configurar JWT_SECRET_KEY en el archivo .env");
}


async function loginUser(username, password) {
  const user = await findUserByUsername(username);

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  if (!user.is_active) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const passwordIsValid = await argon2.verify(
    user.password_hash,
    password
  );

  if (!passwordIsValid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const accessToken = jwt.sign(
    { sub: user.username },
    JWT_SECRET_KEY,
    {
      algorithm: "HS256",
      expiresIn: "30m",
    }
  );

  return {
    access_token: accessToken,
    token_type: "bearer",
  };
}

module.exports = {
  loginUser,
};
