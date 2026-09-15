const request = require("supertest");
const bcrypt = require("bcryptjs");

const app = require("../server");
const User = require("../src/models/User");
const Event = require("../src/models/Event");
const Photo = require("../src/models/Photo");

describe("Gallery PIN Protection", () => {
  let adminToken;
  let gallerySlug;
  let galleryPin;

  const adminEmail = `pin_admin_${Date.now()}@example.com`;
  const password = "TestPassword123";

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name: "PIN Test Admin",
      email: adminEmail,
      passwordHash,
      role: "admin",
    });

    const event = await Event.create({
      name: "PIN Test Event",
      description: "Event for PIN testing",
      createdBy: admin._id,
      teamMembers: [],
    });

    await Photo.create({
      eventId: event._id,
      uploadedBy: admin._id,
      filename: "pin-test-photo.jpg",
      storageUrl: "https://example.com/pin-test-photo.jpg",
      publicId: "pin-test-photo",
      fileSize: 1024,
      selected: true,
    });

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: adminEmail,
        password,
      });

    adminToken = loginResponse.body.token;

    const galleryResponse = await request(app)
      .post(`/api/gallery/events/${event._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    gallerySlug = galleryResponse.body.gallery.slug;
    galleryPin = galleryResponse.body.pin;

    // Publish the gallery
    await request(app)
      .patch(`/api/gallery/${gallerySlug}/publish`)
      .set("Authorization", `Bearer ${adminToken}`);
  });

  test("should allow access with the correct PIN", async () => {
    const response = await request(app)
      .post(`/api/gallery/${gallerySlug}/verify`)
      .send({
        pin: galleryPin,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.gallery.slug).toBe(gallerySlug);
    expect(response.body.gallery.photos).toHaveLength(1);
  });

  test("should reject an incorrect PIN", async () => {
    const wrongPin =
      galleryPin === "000000"
        ? "111111"
        : "000000";

    const response = await request(app)
      .post(`/api/gallery/${gallerySlug}/verify`)
      .send({
        pin: wrongPin,
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test("should reject access when gallery is unpublished", async () => {
    const Gallery = require("../src/models/Gallery");

    await Gallery.findOneAndUpdate(
      { slug: gallerySlug },
      {
        published: false,
        publishedAt: null,
      }
    );

    const response = await request(app)
      .post(`/api/gallery/${gallerySlug}/verify`)
      .send({
        pin: galleryPin,
      });

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
  });
});