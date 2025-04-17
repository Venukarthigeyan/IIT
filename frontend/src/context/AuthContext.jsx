import React, { createContext, useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);

  // Google login handler
  const handleGoogleLoginSuccess = async (response) => {
    const userInfo = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${response.access_token}`,
        },
      }
    );
    const data = await userInfo.json();
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: () => console.log("Login Failed"),
  });

  // Manual login handler
  const manualLogin = async (email, password) => {
    try {
      const response = await fetch("https://iit-backend.onrender.com/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user); // Update the user state after successful login
        localStorage.setItem("user", JSON.stringify(data.user)); // Store user data in localStorage
        return data.user; // Return user data
      } else {
        const errorData = await response.json();
        console.log(errorData.message); // Handle errors
        return null;
      }
    } catch (error) {
      console.log("Manual login failed:", error);
      return null;
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setProfilePicturePreview(null);
    localStorage.removeItem("user");
  };

  // Update profile picture handler
  const updateProfilePhoto = (file) => {
    const previewUrl = URL.createObjectURL(file);
    setProfilePicturePreview(previewUrl);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        googleLogin,
        manualLogin,
        logout,
        profilePicturePreview,
        updateProfilePhoto,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default function GoogleAuthProviderWrapper({ children }) {
  return (
    <GoogleOAuthProvider clientId="271298865885-ccoilnogt3kufdhjf2fv67anskokl1na.apps.googleusercontent.com">
      <AuthContextProvider>{children}</AuthContextProvider>
    </GoogleOAuthProvider>
  );
}
