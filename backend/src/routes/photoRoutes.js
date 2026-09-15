const express = require("express");

const {
  uploadPhoto,
  getEventPhotos,
  selectPhoto,
} = require("../controllers/photoController");

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

// Get all photos for an event
router.get(
  "/events/:eventId",
  protect,
  getEventPhotos
);

// Select or unselect a photo
router.patch(
  "/:photoId/select",
  protect,
  selectPhoto
);

module.exports = router;