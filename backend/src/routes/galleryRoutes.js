const express = require("express");

const {
  createGallery,
  getGalleryByEvent,
  updateGallery,
  regenerateGalleryPin,
  publishGallery,
  verifyGalleryPin,
} = require("../controllers/galleryController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create a gallery for an event
router.post(
  "/events/:eventId",
  protect,
  createGallery
);

// Get gallery for an event
router.get(
  "/events/:eventId",
  protect,
  getGalleryByEvent
);

// Update selected photos in an existing gallery
router.patch(
  "/:slug/update",
  protect,
  updateGallery
);

// Regenerate gallery PIN
router.patch(
  "/:slug/regenerate-pin",
  protect,
  regenerateGalleryPin
);

// Publish a gallery
router.patch(
  "/:slug/publish",
  protect,
  publishGallery
);

// Verify gallery PIN
router.post(
  "/:slug/verify",
  verifyGalleryPin
);

module.exports = router;