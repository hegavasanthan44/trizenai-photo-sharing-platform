const connectDatabase = require("../src/config/database");

beforeAll(async () => {
  await connectDatabase();
});

afterAll(async () => {
  const mongoose = require("mongoose");

  await mongoose.connection.close();
});