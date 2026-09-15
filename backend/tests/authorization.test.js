const request = require("supertest");
const bcrypt = require("bcryptjs");

const app = require("../server");
const User = require("../src/models/User");

describe("Authorization / RBAC API", () => {
  let teamToken;

  const teamEmail = `team_${Date.now()}@example.com`;
  const teamPassword = "TeamPassword123";

  beforeAll(async () => {
    // Create a team member
    const passwordHash = await bcrypt.hash(teamPassword, 10);

    await User.create({
      name: "Authorization Test Team",
      email: teamEmail,
      passwordHash,
      role: "team_member",
    });

    // Login as team member
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: teamEmail,
        password: teamPassword,
      });

    teamToken = response.body.token;
  });

  test("should allow authenticated team member to access their events", async () => {
    const response = await request(app)
      .get("/api/events")
      .set("Authorization", `Bearer ${teamToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test("should prevent team member from creating an event", async () => {
    const response = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${teamToken}`)
      .send({
        name: "Unauthorized Event",
        description: "This should not be created",
      });

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
  });
});