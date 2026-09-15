const streamifier = require("streamifier");

const Photo = require("../models/Photo");
const Event = require("../models/Event");
const cloudinary = require("../config/cloudinary");

const uploadPhoto = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check whether a file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Photo file is required",
      });
    }

    // Find the event
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Only assigned team members can upload photos
    const isAssigned = event.teamMembers.some(
      (memberId) => memberId.toString() === req.user.userId
    );

    if (!isAssigned) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this event",
      });
    }

    // Upload file to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `trizenai/events/${eventId}`,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });

    // Save photo metadata in MongoDB
    const photo = await Photo.create({
      eventId,
      uploadedBy: req.user.userId,
      filename: req.file.originalname,
      storageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      fileSize: req.file.size,
      selected: false,
    });

    res.status(201).json({
      success: true,
      message: "Photo uploaded successfully",
      photo,
    });
  } catch (error) {
    console.error("Photo upload error:", error.message);

    res.status(500).json({
      success: false,
      message: "Photo upload failed",
    });
  }
};

module.exports = {
  uploadPhoto,
};