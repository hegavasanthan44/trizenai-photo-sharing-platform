const Event = require("../models/Event");
const User = require("../models/User");

// =====================================================
// CREATE EVENT
// =====================================================

const createEvent = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Event name is required",
      });
    }

    const event = await Event.create({
      name: name.trim(),
      description: description ? description.trim() : "",
      createdBy: req.user.userId,
      teamMembers: [],
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Create event error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// =====================================================
// GET EVENTS
// =====================================================

const getEvents = async (req, res) => {
  try {
    let events;

    // Admin sees only events created by that admin
    if (req.user.role === "admin") {
      events = await Event.find({
        createdBy: req.user.userId,
      })
        .populate("teamMembers", "name email")
        .sort({ createdAt: -1 });
    }

    // Team member sees only events assigned to them
    else if (req.user.role === "team_member") {
      events = await Event.find({
        teamMembers: req.user.userId,
      })
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });
    }

    else {
      return res.status(403).json({
        success: false,
        message: "Invalid user role",
      });
    }

    res.json({
      success: true,
      events,
    });

  } catch (error) {
    console.error("Get events error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// =====================================================
// GET EVENT BY ID
// =====================================================

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id)
      .populate("createdBy", "name email")
      .populate("teamMembers", "name email");

    // Event doesn't exist
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }


    // =================================================
    // ADMIN AUTHORIZATION
    // =================================================

    if (req.user.role === "admin") {

      const eventCreatorId = event.createdBy._id.toString();

      if (eventCreatorId !== req.user.userId) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to access this event",
        });
      }
    }


    // =================================================
    // TEAM MEMBER AUTHORIZATION
    // =================================================

    if (req.user.role === "team_member") {

      const isAssigned = event.teamMembers.some(
        (member) => member._id.toString() === req.user.userId
      );

      if (!isAssigned) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to access this event",
        });
      }
    }


    // =================================================
    // INVALID ROLE
    // =================================================

    if (
      req.user.role !== "admin" &&
      req.user.role !== "team_member"
    ) {
      return res.status(403).json({
        success: false,
        message: "Invalid user role",
      });
    }


    // =================================================
    // SUCCESS
    // =================================================

    res.json({
      success: true,
      event,
    });

  } catch (error) {

    console.error("Get event error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// =====================================================
// ADD TEAM MEMBER TO EVENT
// =====================================================

const addTeamMember = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId || !userId.trim()) {
      return res.status(400).json({
        success: false,
        message: "Team member User ID is required",
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }


    // Only event creator can add members
    if (event.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Only the event admin can add team members",
      });
    }


    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    // User must be team member
    if (user.role !== "team_member") {
      return res.status(400).json({
        success: false,
        message: "Only team members can be assigned to events",
      });
    }


    // Check duplicate assignment
    const alreadyAssigned = event.teamMembers.some(
      (memberId) => memberId.toString() === userId
    );

    if (alreadyAssigned) {
      return res.status(400).json({
        success: false,
        message: "Team member is already assigned to this event",
      });
    }


    // Add team member
    event.teamMembers.push(userId);

    await event.save();


    // Return populated event
    const updatedEvent = await Event.findById(event._id)
      .populate("createdBy", "name email")
      .populate("teamMembers", "name email");

    res.json({
      success: true,
      message: "Team member added successfully",
      event: updatedEvent,
    });

  } catch (error) {

    console.error("Add team member error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  addTeamMember,
};