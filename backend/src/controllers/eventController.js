const Event = require("../models/Event");
const User = require("../models/User");

// Create a new event
const createEvent = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Event name is required",
      });
    }

    const event = await Event.create({
      name,
      description: description || "",
      createdBy: req.user.userId,
      teamMembers: [],
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Create event error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get events for the logged-in user
const getEvents = async (req, res) => {
  try {
    let events;

    if (req.user.role === "admin") {
      events = await Event.find({
        createdBy: req.user.userId,
      })
        .populate("teamMembers", "name email")
        .sort({ createdAt: -1 });
    } else {
      events = await Event.find({
        teamMembers: req.user.userId,
      })
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });
    }

    res.json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Get events error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get one event
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("teamMembers", "name email");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const isAdmin =
      req.user.role === "admin" &&
      event.createdBy._id.toString() === req.user.userId;

    const isTeamMember =
      req.user.role === "team_member" &&
      event.teamMembers.some(
        (member) => member._id.toString() === req.user.userId
      );

    if (!isAdmin && !isTeamMember) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this event",
      });
    }

    res.json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("Get event error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Add team member to an event
const addTeamMember = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Team member user ID is required",
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (event.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Only the event admin can add team members",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "team_member") {
      return res.status(400).json({
        success: false,
        message: "Only team members can be assigned to events",
      });
    }

    if (event.teamMembers.some((id) => id.toString() === userId)) {
      return res.status(400).json({
        success: false,
        message: "Team member is already assigned to this event",
      });
    }

    event.teamMembers.push(userId);

    await event.save();

    res.json({
      success: true,
      message: "Team member added successfully",
      event,
    });
  } catch (error) {
    console.error("Add team member error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  addTeamMember,
};