const express = require("express");
const { loginUser } = require("../services/authService");

const router = express.Router();

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body || {};

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !password ||
      username.length > 50 ||
      password.length > 1024
    ) {
      return res.status(400).json({
        detail: "Debes proporcionar un usuario y una contraseña válidos.",
      });
    }

    const token = await loginUser(username.trim(), password);

    return res.status(200).json(token);
  } catch (error) {
    if (error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({
        detail: "Usuario o contraseña incorrectos",
      });
    }

    return next(error);
  }
});

module.exports = router;
