const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

if (!JWT_SECRET_KEY) {
  throw new Error("Falta configurar JWT_SECRET_KEY en el archivo .env");
}

function requireAuth(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      detail: "No autorizado",
    });
  }

  const token = authorization.slice("Bearer ".length).trim();

  if (!token) {
    return res.status(401).json({
      detail: "No autorizado",
    });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET_KEY, {
      algorithms: ["HS256"],
    });

    if (typeof payload.sub !== "string" || !payload.sub) {
      return res.status(401).json({
        detail: "Token inválido",
      });
    }

    req.auth = {
      username: payload.sub,
    };

    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        detail: "Token expirado",
      });
    }

    return res.status(401).json({
      detail: "Token inválido",
    });
  }
}

module.exports = {
  requireAuth,
};
