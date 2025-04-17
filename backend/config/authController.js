const User = require("../models/User");

// Login handler
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { password: userPassword, ...userDetails } = user.toObject(); 

    res.status(200).json({
        message: "Login successful",
        user: userDetails, // Send user details without the password
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

