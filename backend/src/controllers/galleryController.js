const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const Gallery = require("../models/Gallery");
const Event = require("../models/Event");
const Photo = require("../models/Photo");

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

    // Only the admin who created the event can create a gallery
    if (
      req.user.role !== "admin" ||
      event.createdBy.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Only the event admin can create a gallery",
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

    // Generate a unique gallery slug
    const slug = crypto.randomBytes(6).toString("hex");

    // Generate a 6-digit PIN
    const pin = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the PIN before storing it
    const pinHash = await bcrypt.hash(pin, 10);

    const gallery = await Gallery.create({
      eventId,
      slug,
      selectedPhotos: selectedPhotos.map((photo) => photo._id),
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
      pin,
    });
  } catch (error) {
    console.error("Create gallery error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create gallery",
    });
  }
};

const publishGallery = async (req, res) => {
  try {
    const { slug } = req.params;

    const gallery = await Gallery.findOne({ slug });

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery not found",
      });
    }

    const event = await Event.findById(gallery.eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Only the admin who created the event can publish the gallery
    if (
      req.user.role !== "admin" ||
      event.createdBy.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Only the event admin can publish this gallery",
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
    console.error("Publish gallery error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to publish gallery",
    });
  }
};

const verifyGalleryPin = async (req, res) => {
  try {
    const { slug } = req.params;
    const { pin } = req.body;

    if (!pin) {
      return res.status(400).json({
        success: false,
        message: "PIN is required",
      });
    }

    const gallery = await Gallery.findOne({ slug });

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery not found",
      });
    }

    if (!gallery.published) {
      return res.status(403).json({
        success: false,
        message: "Gallery is not published",
      });
    }

    const pinMatch = await bcrypt.compare(pin, gallery.pinHash);

    if (!pinMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect PIN",
      });
    }

    const photos = await Photo.find({
      _id: { $in: gallery.selectedPhotos },
      selected: true,
    }).select("filename storageUrl fileSize createdAt");

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
    console.error("Verify gallery PIN error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to verify gallery PIN",
    });
  }
};

module.exports = {
  createGallery,
  publishGallery,
  verifyGalleryPin,
};