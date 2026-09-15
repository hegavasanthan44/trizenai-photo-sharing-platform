const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API is healthy",
  });
});

router.get("/protected", protect, (req, res) => {
  res.json({
    success: true,
    message: "You are authenticated",
    user: req.user,
  });
});

router.get("/admin-only", protect, authorize("admin"), (req, res) => {
  res.json({
    success: true,
    message: "Welcome Admin",
    user: req.user,
  });
});

module.exports = router;