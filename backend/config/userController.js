const User = require("../models/User");
const { sendSignupConfirmationEmail} = require("../config/mailService");

// Handle user sign-up
const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new User({
      name,
      email,
      password, // Save the password as it is without hashing
    });

    // Save the user to the database
    await newUser.save();

    sendSignupConfirmationEmail(email, name);

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
};

// Handle profile update
const updateProfile = async (req, res) => {
  const { name, email, school, class: userClass } = req.body;
  const profilePicture = req.file ? `/uploads/${req.file.filename}` : undefined;

  try {
    // Find user by email and update their details
    const user = await User.findOneAndUpdate(
      { email },
      {
        name,
        school,
        class: userClass,
        profilePicture,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

module.exports = { signUp, updateProfile };