const express = require("express");

const {
  uploadPhoto,
  getEventPhotos,
  getMyPhotos,
  selectPhoto,
} = require("../controllers/photoController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
  "/events/:eventId",
  protect,
  upload.single("photo"),
  uploadPhoto
);

router.get(
  "/events/:eventId",
  protect,
  getEventPhotos
);

router.get(
  "/my",
  protect,
  getMyPhotos
);

router.patch(
  "/:photoId/select",
  protect,
  selectPhoto
);

module.exports = router;