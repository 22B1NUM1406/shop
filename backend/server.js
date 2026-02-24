require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

// ──────────────────────────────────────────
// Database холболт
// ──────────────────────────────────────────
connectDB();

// ──────────────────────────────────────────
// Security Middleware
// ──────────────────────────────────────────
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100,
    message: { success: false, message: "Хэт олон хүсэлт. 15 минутын дараа дахин оролдоно уу." },
});
app.use("/api/", limiter);

// ──────────────────────────────────────────
// CORS
// ──────────────────────────────────────────
app.use(cors({
    origin: [
        process.env.CLIENT_URL || "http://localhost:3000",
        "http://localhost:5173", // Vite default
        "http://localhost:4173", // Vite preview
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

// ──────────────────────────────────────────
// Body Parsing
// ──────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ──────────────────────────────────────────
// Logger (development)
// ──────────────────────────────────────────
if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}

// ──────────────────────────────────────────
// Static files (uploaded images)
// ──────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ──────────────────────────────────────────
// Routes
// ──────────────────────────────────────────
app.use("/api/admin", require("./routes/admin"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));

// ──────────────────────────────────────────
// Health Check
// ──────────────────────────────────────────
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "🛍️ Nomad Online Shop API",
        version: "1.0.0",
        endpoints: {
            admin: "/api/admin",
            products: "/api/products",
            orders: "/api/orders",
        },
    });
});

app.get("/api/health", (req, res) => {
    res.json({ success: true, status: "OK", timestamp: new Date().toISOString() });
});

// ──────────────────────────────────────────
// 404 Handler
// ──────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Хуудас олдсонгүй" });
});

// ──────────────────────────────────────────
// Global Error Handler
// ──────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error("Error:", err.message);

    // Multer error
    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ success: false, message: "Файл хэт том байна (max 5MB)" });
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ success: false, message: messages.join(", ") });
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        return res.status(400).json({ success: false, message: "Давхардсан утга байна" });
    }

    // JWT error
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ success: false, message: "Token буруу байна" });
    }

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Серверийн алдаа",
    });
});

// ──────────────────────────────────────────
// Start Server
// ──────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════╗
║   🛍️  Nomad Online Shop API          ║
║   Port: ${PORT}                          ║
║   Env:  ${process.env.NODE_ENV || "development"}                ║
╚══════════════════════════════════════╝
  `);
});

module.exports = app;