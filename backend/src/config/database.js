const mongoose = require("mongoose");
const dns = require("dns");

const connectDatabase = async () => {
  try {
    // Use Google DNS for MongoDB SRV lookup
    dns.setServers(["8.8.8.8", "8.8.4.4"]);

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDatabase;