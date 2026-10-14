const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;


app.use(helmet());
app.use(express.json({ limit: "10kb" }));


const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        detail: "Demasiadas solicitudes. Intenta nuevamente más tarde."
    }
});

app.use("/api", apiLimiter);

const frontendOrigin = process.env.FRONTEND_ORIGIN;

app.use(cors({
    origin: frontendOrigin ? [frontendOrigin] : false,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

app.use("/api", authRoutes);
app.use("/api", dashboardRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        service: "back-cbs-njs"
    });
});


app.use((req, res) => {
    res.status(404).json({
        detail: "Endpoint no encontrado"
    });
});


app.use((err, req, res, next) => {
    console.error("Error interno:", err.message);

    res.status(500).json({
        detail: "Error interno del servidor"
    });
});

app.listen(PORT, "127.0.0.1", () => {
    console.log(`API Node.js escuchando en http://127.0.0.1:${PORT}`);
});