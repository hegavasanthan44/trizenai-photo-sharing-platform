require("dotenv").config();

const express = require("express");
const cors = require("cors");
const dns = require("dns");

const connectDatabase = require("./src/config/database");
const healthRoutes = require("./src/routes/healthRoutes");
const authRoutes = require("./src/routes/authRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// Use Google DNS for MongoDB SRV lookup
dns.setServers(["8.8.8.8", "8.8.4.4"]);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "TrizenAI Photo Sharing API is running",
  });
});

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);

const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();