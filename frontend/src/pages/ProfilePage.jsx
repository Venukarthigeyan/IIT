import React, { useContext, useState, useEffect } from "react";
import { Button, Typography, Container, Avatar, TextField, Box, IconButton, MenuItem, Stack } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import EditIcon from "@mui/icons-material/Edit";
import { useHistory } from "react-router-dom";

const ProfilePage = () => {
  const { user, logout, updateProfilePhoto } = useContext(AuthContext); // updateProfilePhoto function
  const history = useHistory();

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    school: "",
    class: "",
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`http://localhost:5001/user/getProfile`, {
          method: "GET",
          headers: {
            Email: user?.email,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        setProfileData({
          name: data.name,
          email: data.email,
          school: data.school,
          class: data.class,
        });

        if (data.profilePicture) {
          const profilePictureUrl = data.profilePicture
            ? `http://localhost:5001${data.profilePicture}`
            : null;

          setProfilePicturePreview(profilePictureUrl);
        } else {
          setProfilePicturePreview("/default-avatar.png");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", profileData.name);
      formData.append("email", profileData.email);
      formData.append("school", profileData.school);
      formData.append("class", profileData.class);
      if (profilePicture) formData.append("profilePicture", profilePicture);

      const response = await fetch("http://localhost:5001/user/updateProfile", {
        method: "POST",
        headers: {
          Email: user?.email,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      console.log("Profile updated:", data);
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const previewUrl = URL.createObjectURL(file);
      setProfilePicturePreview(previewUrl);
      updateProfilePhoto(file); // Update profile photo in AuthContext
    }
  };

  const handleLogout = () => {
    logout();
    history.push("/");
  };

  const goToDashboard = () => {
    history.push("/dashboard");
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: "url('/images/background.jpg')",
        backgroundSize: "cover",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container
        maxWidth="sm"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "30px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "15px",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
        }}
      >
        {user ? (
          <>
            <Box
              style={{
                position: "relative",
                marginBottom: "20px",
                cursor: "pointer",
                transition: "all 0.3s ease-in-out",
              }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <Avatar
                alt={profileData.name}
                src={profilePicturePreview || "/default-avatar.png"}
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  border: "4px solid #fff",
                }}
              />

              <IconButton
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  color: "#fff",
                  visibility: isHovering ? "visible" : "hidden",
                }}
                component="label"
              >
                <EditIcon />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  hidden
                />
              </IconButton>
            </Box>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              style={{ marginBottom: "15px" }}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              style={{ marginBottom: "15px" }}
            />
            <TextField
              label="School"
              variant="outlined"
              fullWidth
              value={profileData.school}
              onChange={(e) => setProfileData({ ...profileData, school: e.target.value })}
              style={{ marginBottom: "15px" }}
            />
            <TextField
              select
              label="Class"
              variant="outlined"
              fullWidth
              value={profileData.class}
              onChange={(e) => setProfileData({ ...profileData, class: e.target.value })}
              style={{ marginBottom: "20px" }}
            >
              {[
                "Class I",
                "Class II",
                "Class III",
                "Class IV",
                "Class V",
                "Class VI",
                "Class VII",
                "Class VIII",
                "Class IX",
                "Class X",
                "Class XI",
                "Class XII",
              ].map((cls) => (
                <MenuItem key={cls} value={cls}>
                  {cls}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="contained"
              color="primary"
              onClick={handleProfileUpdate}
              fullWidth
              style={{ marginTop: "20px" }}
            >
              Save Profile
            </Button>
            <Stack direction="row" spacing={2} style={{ marginTop: "20px", width: "100%" }}>
              <Button variant="outlined" color="secondary" onClick={goToDashboard} fullWidth>
                Back to Dashboard
              </Button>
              <Button variant="contained" color="error" onClick={handleLogout} fullWidth>
                Logout
              </Button>
            </Stack>
          </>
        ) : (
          <Typography>No user logged in</Typography>
        )}
      </Container>
    </div>
  );
};

export default ProfilePage;
