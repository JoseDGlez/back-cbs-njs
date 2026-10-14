const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard", requireAuth, (req, res) => {
  return res.status(200).json({
    message: "Acceso autorizado al Dashboard",
    username: req.auth.username,
    authenticated: true,
  });
});

module.exports = router;
