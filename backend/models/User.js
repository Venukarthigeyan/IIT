const mongoose = require("mongoose");

// Define the schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name must be at most 50 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    school: {
      type: String,
      trim: true, // Not required during sign-up
    },
    class: {
      type: String,
      trim: true, // Not required during sign-up
    },
    profilePicture: {
      type: String, // Will store the file path or URL of the profile picture
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create the model
const User = mongoose.model("User", userSchema);

module.exports = User;