import React, { useState } from "react";
import { Container, TextField, Button, Typography } from "@mui/material";
import { useHistory } from "react-router-dom"; // Use useHistory for react-router-dom v5.x

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const history = useHistory(); // Use history for navigation

  const validateEmail = (email) => {
    // Basic email regex for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async () => {
    if (validateEmail(email)) {
      setError(""); // Clear any existing error

      try {
        const response = await fetch("https://iit-backend.onrender.com/user/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
          alert(data.message); // Display success message
          history.push("/"); // Redirect to home page
        } else {
          setError(data.message); // Display error message
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Something went wrong. Please try again later.");
      }
    } else {
      setError("Please enter a valid email address.");
    }
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
          Forgot Password
        </Typography>
        <TextField
          label="Enter your email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!error}
          helperText={error}
          style={{
            marginBottom: "20px",
            backgroundColor: "rgba(255, 255, 255, 0.6)", // Transparent input background
            borderRadius: "5px",
          }}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleResetPassword}
          style={{
            backgroundColor: "#1976D2", // Subtle blue
            color: "#FFFFFF",
            fontWeight: "bold",
            padding: "10px 0",
            borderRadius: "5px",
          }}
        >
          Reset Password
        </Button>
      </Container>
    </div>
  );
};

export default ForgotPasswordPage;
