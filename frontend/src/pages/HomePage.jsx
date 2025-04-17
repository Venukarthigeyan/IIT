import React, { useContext, useState } from "react";
import {
  Button,
  Container,
  Typography,
  TextField,
  Divider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useHistory } from "react-router-dom"; // For react-router-dom v5
import { AuthContext } from "../context/AuthContext";
import GoogleLogo from "../assets/google-logo.png"; // Ensure the path to your Google logo image is correct

const HomePage = () => {
  const history = useHistory(); // Replace useNavigate with useHistory
  const { googleLogin, manualLogin } = useContext(AuthContext);

  // State for email, password, and password visibility
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  // Email validation regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle form submission
  const handleLogin = async () => {
    let hasError = false;
    const newErrors = { email: "", password: "" };

    // Email validation
    if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address.";
      hasError = true;
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required.";
      hasError = true;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      hasError = true;
    }

    setErrors(newErrors);

    if (!hasError) {
      const user = await manualLogin(email, password); // Call manualLogin
      if (user) {
        alert("Logged in successfully!");
        history.push("/dashboard"); // Navigate to dashboard
      } else {
        alert("Login failed");
      }
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    await googleLogin();
    history.push("/dashboard"); // Redirect using history.push
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
          gutterBottom
          style={{
            color: "#4A4A4A", // Subtle dark gray
            fontWeight: "600",
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          Welcome to Digitify
        </Typography>
        <Typography
          variant="body1"
          style={{
            marginBottom: "20px",
            color: "#6A6A6A", // Softer gray for secondary text
            fontFamily: "'Roboto', serif",
          }}
        >
          Your platform for reading, annotating, and collaborating on eBooks.
        </Typography>

        {/* Email Input */}
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
          InputLabelProps={{
            style: {
              color: "#888888", // Soft label color
            },
          }}
          InputProps={{
            style: {
              backgroundColor: "rgba(255, 255, 255, 0.6)", // Transparent input background
              borderRadius: "5px",
            },
          }}
          style={{
            marginBottom: "15px",
          }}
        />

        {/* Password Input */}
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
          InputLabelProps={{
            style: {
              color: "#888888", // Soft label color
            },
          }}
          InputProps={{
            style: {
              backgroundColor: "rgba(255, 255, 255, 0.6)", // Transparent input background
              borderRadius: "5px",
            },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          style={{
            marginBottom: "20px",
          }}
        />

        {/* Login Button */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleLogin}
          style={{
            marginBottom: "15px",
            backgroundColor: "#1976D2", // Subtle blue
            color: "#FFFFFF",
            fontWeight: "bold",
            padding: "10px 0",
            borderRadius: "5px",
          }}
        >
          Login
        </Button>

        {/* Divider with OR */}
        <Divider
          style={{
            margin: "20px 0",
            width: "100%",
            color: "#9E9E9E", // Divider line color
          }}
        >
          OR
        </Divider>

        {/* Google Login Button */}
        <Button
          variant="outlined"
          fullWidth
          onClick={handleGoogleLogin}
          style={{
            marginBottom: "15px",
            color: "#1976D2", // Blue text color
            fontWeight: "bold",
            fontSize: "16px",
            textTransform: "none", // Prevents the text from being uppercase
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderColor: "#1976D2",
            borderRadius: "30px", // Fully rounded button
            padding: "10px 0",
          }}
        >
          <img
            src={GoogleLogo}
            alt="Google Logo"
            style={{
              height: "24px",
              width: "24px",
              marginRight: "10px",
              borderRadius: "50%", // Makes the logo circular
            }}
          />
          Login with Google
        </Button>

        {/* Forgot Password Link */}
        <Button
          variant="text"
          style={{
            color: "#4A4A4A", // Muted dark gray
            marginTop: "10px",
            fontFamily: "'Roboto', sans-serif",
          }}
          onClick={() => history.push("/forgot-password")} // Use history.push instead of navigate
        >
          Forgot Password?
        </Button>
        <Typography
          variant="body2"
          style={{
            marginTop: "20px",
            color: "#6A6A6A", // Softer gray
            fontFamily: "'Roboto', serif",
          }}
        >
          Don't have an account?{" "}
          <Button
            variant="text"
            style={{
              color: "#1976D2", // Subtle blue for sign-up link
              fontWeight: "bold",
            }}
            onClick={() => history.push("/signup")}
          >
            Sign Up
          </Button>
        </Typography>
      </Container>
    </div>
  );
};

export default HomePage;
