const request = require("supertest");
const bcrypt = require("bcryptjs");

const app = require("../server");
const User = require("../src/models/User");
const Event = require("../src/models/Event");

describe("Photo Access Control", () => {
  let teamToken;
  let assignedEvent;
  let otherEvent;

  const teamEmail = `photo_team_${Date.now()}@example.com`;
  const password = "TestPassword123";

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(password, 10);

    const teamMember = await User.create({
      name: "Photo Access Test Team",
      email: teamEmail,
      passwordHash,
      role: "team_member",
    });

    // Event assigned to the team member
    assignedEvent = await Event.create({
      name: "Assigned Test Event",
      description: "Event assigned to test team member",
      createdBy: teamMember._id,
      teamMembers: [teamMember._id],
    });

    // Another event where the team member is NOT assigned
    otherEvent = await Event.create({
      name: "Other Test Event",
      description: "Event not assigned to test team member",
      createdBy: teamMember._id,
      teamMembers: [],
    });

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: teamEmail,
        password,
      });

    teamToken = loginResponse.body.token;
  });

  test("should allow team member to access an assigned event", async () => {
    const response = await request(app)
      .get(`/api/events/${assignedEvent._id}`)
      .set("Authorization", `Bearer ${teamToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test("should prevent team member from accessing an unassigned event", async () => {
    const response = await request(app)
      .get(`/api/events/${otherEvent._id}`)
      .set("Authorization", `Bearer ${teamToken}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
  });
});