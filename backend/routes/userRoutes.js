const express = require("express");
const multer = require("multer");
const path = require("path");
const userController = require("../config/userController");
const { login } = require("../config/authController");
const User = require("../models/User");
const { sendPasswordEmail } = require("../config/mailService");

const router = express.Router();

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fieldSize: 5 * 1024 * 1024,
});

// Route to create a new user
router.post("/signup", userController.signUp);

// Route for login
router.post("/login", login);

// Route to update user profile (including profile picture)
router.post("/updateProfile", upload.single("profilePicture"), userController.updateProfile);

// Route to get user profile
router.get("/getProfile", async (req, res) => {
  try {
    const email = req.get("Email"); // Get email from the header
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      name: user.name,
      email: user.email,
      school: user.school,
      class: user.class,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to handle forgot password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    sendPasswordEmail(email, user.password);

    res.status(200).json({ message: "Password sent to your email." });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;
