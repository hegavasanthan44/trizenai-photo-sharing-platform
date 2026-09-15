const express = require("express");

const {
  createGallery,
  getGalleryByEvent,
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

router.get(
  "/events/:eventId",
  protect,
  getGalleryByEvent
);


module.exports = router;    