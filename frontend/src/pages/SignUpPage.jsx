import React, { useState } from "react";
import { Container, TextField, Button, Typography, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material"; // Import visibility icons
import { useHistory } from "react-router-dom"; // Use `useHistory` for react-router-dom@5.3.4

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility
  const history = useHistory(); // Replaces `useNavigate`

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    const newErrors = {};
    const { name, email, password, confirmPassword } = formData;

    // Form validation
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!email.trim() || !validateEmail(email))
      newErrors.email = "Please enter a valid email address.";
    if (!password.trim()) newErrors.password = "Password is required.";
    if (password.trim() && password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({}); // Clear errors if any

    try {
      // Send user data to backend
      const response = await fetch("https://iit-backend.onrender.com/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }), // Sending name, email, password
      });

      const result = await response.json();

      if (response.ok) {
        alert("Account created successfully!");
        history.push("/"); // Redirect to the home page
      } else {
        // Handle errors returned from the backend
        alert(result.message || "Error creating account");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Toggle password visibility
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: "url('/images/background.jpg')", // Path to your background image
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container
        maxWidth="xs"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "30px",
          backgroundColor: "rgba(255, 255, 255, 0.9)", // Soft white with transparency
          borderRadius: "15px",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)", // Subtle shadow for depth
        }}
      >
        <Typography
          variant="h4"
          style={{
            marginBottom: "20px",
            color: "#4A4A4A", // Subtle dark gray
            fontWeight: "600",
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          Sign Up
        </Typography>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          style={{
            marginBottom: "15px",
            backgroundColor: "rgba(255, 255, 255, 0.6)", // Transparent input background
            borderRadius: "5px",
          }}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          style={{
            marginBottom: "15px",
            backgroundColor: "rgba(255, 255, 255, 0.6)", // Transparent input background
            borderRadius: "5px",
          }}
        />
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          fullWidth
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          style={{
            marginBottom: "15px",
            backgroundColor: "rgba(255, 255, 255, 0.6)", // Transparent input background
            borderRadius: "5px",
          }}
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleClickShowPassword} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />
        <TextField
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          variant="outlined"
          fullWidth
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          style={{
            marginBottom: "20px",
            backgroundColor: "rgba(255, 255, 255, 0.6)", // Transparent input background
            borderRadius: "5px",
          }}
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleClickShowConfirmPassword} edge="end">
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          style={{
            backgroundColor: "#1976D2", // Subtle blue
            color: "#FFFFFF",
            fontWeight: "bold",
            padding: "10px 0",
            borderRadius: "5px",
          }}
        >
          Create Account
        </Button>
      </Container>
    </div>
  );
};

export default SignUpPage;
