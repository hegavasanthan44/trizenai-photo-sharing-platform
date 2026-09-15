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


// =====================================================
// DNS CONFIGURATION
// =====================================================

dns.setServers([
  "8.8.8.8",
  "8.8.4.4",
]);


// =====================================================
// CORS CONFIGURATION
// =====================================================

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {

      // Allow requests without an Origin header.
      // Useful for tools such as Postman.
      if (!origin) {
        return callback(null, true);
      }

      // Allow only configured frontend origins.
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Not allowed by CORS")
      );
    },
  })
);


// =====================================================
// BODY PARSER
// =====================================================

app.use(express.json());


// =====================================================
// ROOT ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TrizenAI Photo Sharing API is running",
  });
});


// =====================================================
// API ROUTES
// =====================================================

app.use("/api/health", healthRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/events", eventRoutes);

app.use("/api/photos", photoRoutes);

app.use("/api/gallery", galleryRoutes);


// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use((error, req, res, next) => {
  console.error("Server error:", error.message);

  // CORS error
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


// =====================================================
// START SERVER
// =====================================================

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


startServer();