import React, { useContext, useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  CircularProgress,
  Box,
  Container,
  Divider,
  IconButton,
  Card,
  CardContent,
  CardActionArea,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import SearchIcon from "@mui/icons-material/Search";
import ChatIcon from "@mui/icons-material/Chat";
import PDFViewer from "./PDFViewer"; // Import your PDFViewer component

const DashboardPage = () => {
  const history = useHistory();
  const { user, profilePicturePreview } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [isBookOpen, setIsBookOpen] = useState(null); // State to control PDFViewer visibility

  const books = [
    {
      id: 1,
      imageUrl: "/Science.jpg",
      title: "CLASS X SCIENCE",
      pdfUrl: "/pdfs/X/Science/Science Textbook.pdf",
    },
    {
      id: 2,
      imageUrl: "/lebo1cc.jpg",
      title: "CLASS XII BIOLOGY",
      pdfUrl: "/pdfs/XII/Biology/Biology Textbook.pdf",
    },
  ];

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f0f4f8",
        }}
      >
        <CircularProgress color="primary" />
      </div>
    );
  }

  const handleSearchClick = () => {
    history.push("/search");
  };

  const handleProfileClick = () => {
    history.push("/profile");
  };

  const handleChatClick = () => {
    history.push("/chat");
  };

  const handleBookClick = (pdfUrl) => {
    setIsBookOpen(pdfUrl); // Set the specific PDF URL to open
  };

  const handleCloseBook = () => {
    setIsBookOpen(null); // Close the PDFViewer
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/images/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      {!isBookOpen && ( // Hide the AppBar when the book is open
        <AppBar
          position="sticky"
          style={{
            background: "linear-gradient(90deg, #F6F7FB, #E3E8F0)",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Toolbar style={{ padding: "16px 24px" }}>
            <Avatar
              src={profilePicturePreview || "/images/default-avatar.png"}
              sx={{
                width: 60,
                height: 60,
                marginRight: "20px",
                backgroundColor: "#1976D2",
                color: "#FFFFFF",
              }}
            >
              {!profilePicturePreview && user?.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}
            </Avatar>
            <Typography
              variant="h6"
              style={{
                flexGrow: 1,
                fontWeight: "600",
                color: "#2C3E50",
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              Welcome, {user?.name || "User"}
            </Typography>
            <IconButton
              color="inherit"
              onClick={handleSearchClick}
              style={{
                color: "black",
                fontSize: "30px",
                marginRight: "20px",
              }}
            >
              <SearchIcon />
            </IconButton>
            <IconButton
              color="inherit"
              onClick={handleChatClick}
              style={{
                color: "#000",
                fontSize: "30px",
                marginRight: "20px",
                transition: "color 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.color = "#3a9ff3")}
              onMouseOut={(e) => (e.target.style.color = "#000")}
            >
              <ChatIcon />
            </IconButton>
            <Button
              color="inherit"
              style={{
                color: "#FFFFFF",
                backgroundColor: "#000000",
                fontWeight: "500",
                borderRadius: "20px",
                textTransform: "capitalize",
                padding: "8px 16px",
                border: "1px solid #000000",
                transition: "all 0.3s ease",
              }}
              onClick={handleProfileClick}
              onMouseOver={(e) =>
                (e.target.style.backgroundColor = "#333333")
              }
              onMouseOut={(e) =>
                (e.target.style.backgroundColor = "#000000")
              }
            >
              Profile
            </Button>
          </Toolbar>
          <Divider style={{ backgroundColor: "#ccc" }} />
        </AppBar>
      )}
      <Box
        component="div"
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          marginTop: "30px",
        }}
      >
        <Container
          maxWidth="lg"
          style={{
            padding: "40px",
            backgroundColor: "#fff",
            borderRadius: "20px",
            boxShadow: "0px 16px 40px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="h5"
            style={{
              fontWeight: "bold",
              marginBottom: "20px",
              color: "#2C3E50",
              textAlign: "center",
            }}
          >
            Recommended Books
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: "180px",
              flexWrap: "wrap",
            }}
          >
            {books.map((book) => (
              <Card
                key={book.id}
                sx={{
                  maxWidth: 170,
                  height: 320,
                  boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
                  borderRadius: "12px",
                }}
              >
                <CardActionArea onClick={() => handleBookClick(book.pdfUrl)}>
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    style={{
                      width: "100%",
                      height: "auto",
                      borderTopLeftRadius: "12px",
                      borderTopRightRadius: "12px",
                    }}
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      style={{
                        fontWeight: "bold",
                        color: "#2C3E50",
                        fontSize: "1rem",
                        textAlign: "center",
                      }}
                    >
                      {book.title}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>
      {isBookOpen && (
        <Box
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <Container
            maxWidth="lg"
            style={{
              padding: "20px",
              backgroundColor: "#fff",
              borderRadius: "12px",
              position: "relative",
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Button
              onClick={handleCloseBook}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "#FF5A5A",
                color: "#fff",
              }}
            >
              Close
            </Button>
            <PDFViewer fileUrl={isBookOpen} />
          </Container>
        </Box>
      )}
    </div>
  );
};

export default DashboardPage;
