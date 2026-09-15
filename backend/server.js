require("dotenv").config();

const express = require("express");
const cors = require("cors");
const dns = require("dns");

const connectDatabase = require("./src/config/database");

const healthRoutes = require("./src/routes/healthRoutes");
const authRoutes = require("./src/routes/authRoutes");
const eventRoutes = require("./src/routes/eventRoutes");
const photoRoutes = require("./src/routes/photoRoutes");
const galleryRoutes = require("./src/routes/galleryRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

dns.setServers([
  "8.8.8.8",
  "8.8.4.4",
]);

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TrizenAI Photo Sharing API is running",
  });
});

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/gallery", galleryRoutes);

app.use((error, req, res, next) => {
  console.error("Server error:", error.message);

  if (error.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "Request blocked by CORS policy",
    });
  }

  res.status(500).json({
    success: false,
    message: "Server error",
  });
});

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error.message
    );

    process.exit(1);
  }
};

// Start the server only when running:
// npm start
if (require.main === module) {
  startServer();
}

// Export Express app for Jest/Supertest
module.exports = app;