const express = require("express");

const {
  createEvent,
  getEvents,
  getEventById,
  addTeamMember,
} = require("../controllers/eventController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// Create event
router.post(
  "/",
  protect,
  authorize("admin"),
  createEvent
);

// Get events for logged-in user
router.get(
  "/",
  protect,
  getEvents
);

// Get one event
router.get(
  "/:id",
  protect,
  getEventById
);

// Add team member to event
router.post(
  "/:id/members",
  protect,
  authorize("admin"),
  addTeamMember
);

module.exports = router;