const request = require("supertest");
const app = require("../server");

describe("Authentication API", () => {
  const testEmail = `test_${Date.now()}@example.com`;

  test("should register a team member", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test Team Member",
        email: testEmail,
        password: "TestPassword123",
        role: "team_member",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.user.email).toBe(testEmail);
    expect(response.body.user.role).toBe("team_member");
  });

  test("should login with valid credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: testEmail,
        password: "TestPassword123",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe(testEmail);
  });

  test("should reject invalid login credentials", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: testEmail,
        password: "WrongPassword123",
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });
});