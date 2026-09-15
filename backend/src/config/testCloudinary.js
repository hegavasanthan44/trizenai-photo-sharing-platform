require("dotenv").config();

const cloudinary = require("./cloudinary");

const testCloudinary = async () => {
  try {
    const result = await cloudinary.api.ping();

    console.log("Cloudinary connected successfully");
    console.log(result);
  } catch (error) {
    console.error("Cloudinary connection failed");
    console.error(error.message);
  }
};

testCloudinary();