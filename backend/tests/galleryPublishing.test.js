const request = require("supertest");
const bcrypt = require("bcryptjs");

const app = require("../server");
const User = require("../src/models/User");
const Event = require("../src/models/Event");
const Photo = require("../src/models/Photo");

describe("Gallery Publishing Workflow", () => {
  let adminToken;
  let teamToken;
  let admin;
  let teamMember;
  let event;
  let photo;

  const adminEmail = `gallery_admin_${Date.now()}@example.com`;
  const teamEmail = `gallery_team_${Date.now()}@example.com`;
  const password = "TestPassword123";

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(password, 10);

    // Create admin
    admin = await User.create({
      name: "Gallery Test Admin",
      email: adminEmail,
      passwordHash,
      role: "admin",
    });

    // Create team member
    teamMember = await User.create({
      name: "Gallery Test Team",
      email: teamEmail,
      passwordHash,
      role: "team_member",
    });

    // Create event
    event = await Event.create({
      name: "Gallery Test Event",
      description: "Event for gallery testing",
      createdBy: admin._id,
      teamMembers: [teamMember._id],
    });

    // Create a fake photo record.
    // We do not upload to Cloudinary because this test
    // is testing the gallery workflow, not file upload.
    photo = await Photo.create({
      eventId: event._id,
      uploadedBy: teamMember._id,
      filename: "test-photo.jpg",
      storageUrl: "https://example.com/test-photo.jpg",
      publicId: "test-photo-public-id",
      fileSize: 1024,
      selected: true,
    });

    // Login admin
    const adminLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: adminEmail,
        password,
      });

    adminToken = adminLogin.body.token;

    // Login team member
    const teamLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: teamEmail,
        password,
      });

    teamToken = teamLogin.body.token;
  });

  test("should allow admin to create a gallery", async () => {
    const response = await request(app)
      .post(`/api/gallery/events/${event._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.gallery.slug).toBeDefined();
    expect(response.body.pin).toBeDefined();
    expect(response.body.pin).toMatch(/^\d{6}$/);
  });

  test("should prevent team member from creating a gallery", async () => {
    const response = await request(app)
      .post(`/api/gallery/events/${event._id}`)
      .set("Authorization", `Bearer ${teamToken}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
  });
});