const express = require("express");

const { uploadPhoto } = require("../controllers/photoController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Upload a photo to an event
router.post(
  "/events/:eventId",
  protect,
  upload.single("photo"),
  uploadPhoto
);

module.exports = router;