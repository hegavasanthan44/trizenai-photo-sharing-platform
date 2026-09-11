require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDatabase = require("./src/config/database");
const healthRoutes = require("./src/routes/healthRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "TrizenAI Photo Sharing API is running",
  });
});

app.use("/api/health", healthRoutes);

const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();