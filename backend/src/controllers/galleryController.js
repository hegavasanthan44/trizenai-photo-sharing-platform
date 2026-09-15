const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const Gallery = require("../models/Gallery");
const Event = require("../models/Event");
const Photo = require("../models/Photo");


// =====================================================
// CREATE GALLERY
// =====================================================

const createGallery = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Only event admin can create gallery
    if (
      req.user.role !== "admin" ||
      event.createdBy.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Only the event admin can create a gallery",
      });
    }

    // Check existing gallery
    const existingGallery = await Gallery.findOne({
      eventId,
    });

    if (existingGallery) {
      return res.status(400).json({
        success: false,
        message: "A gallery already exists for this event",
      });
    }

    // Get selected photos
    const selectedPhotos = await Photo.find({
      eventId,
      selected: true,
    });

    if (selectedPhotos.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one photo",
      });
    }

    // Generate unique gallery slug
    const slug = crypto.randomBytes(6).toString("hex");

    // Generate secure 6-digit PIN
    const pin = crypto
      .randomInt(100000, 1000000)
      .toString();

    // Hash PIN
    const pinHash = await bcrypt.hash(pin, 10);

    const gallery = await Gallery.create({
      eventId,
      slug,
      selectedPhotos: selectedPhotos.map(
        (photo) => photo._id
      ),
      pinHash,
      published: false,
    });

    res.status(201).json({
      success: true,
      message: "Gallery created successfully",

      gallery: {
        id: gallery._id,
        eventId: gallery.eventId,
        slug: gallery.slug,
        selectedPhotoCount: selectedPhotos.length,
        published: gallery.published,
      },

      // Show PIN only when gallery is created
      pin,
    });

  } catch (error) {
    console.error(
      "Create gallery error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create gallery",
    });
  }
};


// =====================================================
// GET GALLERY BY EVENT
// =====================================================

const getGalleryByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Only event admin can view gallery management
    if (
      req.user.role !== "admin" ||
      event.createdBy.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Only the event admin can view this gallery",
      });
    }

    const gallery = await Gallery.findOne({
      eventId,
    });

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery not found",
      });
    }

    res.json({
      success: true,

      gallery: {
        id: gallery._id,
        eventId: gallery.eventId,
        slug: gallery.slug,
        selectedPhotoCount:
          gallery.selectedPhotos.length,
        published: gallery.published,
        publishedAt: gallery.publishedAt,
      },
    });

  } catch (error) {
    console.error(
      "Get gallery error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to get gallery",
    });
  }
};


// =====================================================
// REGENERATE GALLERY PIN
// =====================================================

const regenerateGalleryPin = async (req, res) => {
  try {
    const { slug } = req.params;

    const gallery = await Gallery.findOne({
      slug,
    });

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery not found",
      });
    }

    const event = await Event.findById(
      gallery.eventId
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Only event admin can regenerate PIN
    if (
      req.user.role !== "admin" ||
      event.createdBy.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only the event admin can regenerate the PIN",
      });
    }

    // Generate secure PIN
    const pin = crypto
      .randomInt(100000, 1000000)
      .toString();

    const pinHash = await bcrypt.hash(pin, 10);

    gallery.pinHash = pinHash;

    await gallery.save();

    res.json({
      success: true,
      message:
        "Gallery PIN regenerated successfully",
      pin,
    });

  } catch (error) {
    console.error(
      "Regenerate gallery PIN error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to regenerate gallery PIN",
    });
  }
};


// =====================================================
// PUBLISH GALLERY
// =====================================================

const publishGallery = async (req, res) => {
  try {
    const { slug } = req.params;

    const gallery = await Gallery.findOne({
      slug,
    });

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery not found",
      });
    }

    const event = await Event.findById(
      gallery.eventId
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Only event admin can publish
    if (
      req.user.role !== "admin" ||
      event.createdBy.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only the event admin can publish this gallery",
      });
    }

    if (gallery.published) {
      return res.status(400).json({
        success: false,
        message: "Gallery is already published",
      });
    }

    gallery.published = true;
    gallery.publishedAt = new Date();

    await gallery.save();

    res.json({
      success: true,
      message: "Gallery published successfully",

      gallery: {
        id: gallery._id,
        eventId: gallery.eventId,
        slug: gallery.slug,
        published: gallery.published,
        publishedAt: gallery.publishedAt,
      },
    });

  } catch (error) {
    console.error(
      "Publish gallery error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to publish gallery",
    });
  }
};


// =====================================================
// VERIFY GALLERY PIN
// =====================================================

const verifyGalleryPin = async (req, res) => {
  try {
    const { slug } = req.params;
    const { pin } = req.body;

    // Validate PIN
    if (!pin) {
      return res.status(400).json({
        success: false,
        message: "PIN is required",
      });
    }

    if (!/^\d{6}$/.test(pin)) {
      return res.status(400).json({
        success: false,
        message: "PIN must be exactly 6 digits",
      });
    }

    // Find gallery
    const gallery = await Gallery.findOne({
      slug,
    });

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery not found",
      });
    }

    // Gallery must be published
    if (!gallery.published) {
      return res.status(403).json({
        success: false,
        message: "Gallery is not published",
      });
    }

    // Verify PIN
    const pinMatch = await bcrypt.compare(
      pin,
      gallery.pinHash
    );

    if (!pinMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect PIN",
      });
    }

    // =================================================
    // GET ONLY SELECTED PHOTOS
    // =================================================

    const photos = await Photo.find({
      _id: {
        $in: gallery.selectedPhotos,
      },
      selected: true,
    }).select(
      "filename storageUrl fileSize createdAt"
    );

    // Return Cloudinary URL
    // This is the URL that was already working
    res.json({
      success: true,
      message: "PIN verified successfully",

      gallery: {
        slug: gallery.slug,
        eventId: gallery.eventId,
        photos,
      },
    });

  } catch (error) {
    console.error(
      "Verify gallery PIN error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to verify gallery PIN",
    });
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createGallery,
  getGalleryByEvent,
  regenerateGalleryPin,
  publishGallery,
  verifyGalleryPin,
};