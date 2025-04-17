
import React, { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Typography,
  Button,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import PDFViewer from "./PDFViewer"; // Import the PDFViewer component

const SearchBooks = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedBookTitle, setSelectedBookTitle] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [showPdfViewer, setShowPdfViewer] = useState(false);

  const history = useHistory();
// Example data for subjects and books (replace with actual data)
const subjects = {
    I: ["English", "Hindi", "Mathematics"],
    II: ["English", "Hindi", "Mathematics"],
    III: [
      "Arts",
      "English",
      "Hindi",
      "Mathematics",
      "Physical Education and Wellbeing",
      "The World Around Us",
    ],
    IV: ["English", "Environmental Studies", "Hindi", "Mathematics"],
    V: ["English", "Environmental Studies", "Hindi", "Mathematics"],
    VI: [
      "Arts",
      "English",
      "Environmental Studies",
      "Hindi",
      "Mathematics",
      "Physical Education and Wellbeing",
      "Sanskrit",
      "Science",
      "Social Science",
      "Vocational Education",
    ],
    VII: ["English", "Hindi", "Mathematics", "Sanskrit", "Science", "Social Science"],
    VIII: ["English", "Hindi", "Mathematics", "Sanskrit", "Science", "Social Science"],
    IX: [
      "English",
      "Health and Physical Education",
      "Hindi",
      "Information and Communication Technology",
      "Mathematics",
      "Sanskrit",
      "Science",
      "Social Science",
    ],
    X: [
      "English",
      "Health and Physical Education",
      "Hindi",
      "Mathematics",
      "Sanskrit",
      "Science",
      "Social Science",
    ],
    XI: [
      "Accountancy",
      "Biology",
      "Business Studies",
      "Chemistry",
      "Computer Science",
      "Creative Writing & Translation",
      "Economics",
      "English",
      "Fine Art",
      "Geography",
      "History",
      "Home Science",
      "Informatics Practices",
      "Mathematics",
      "Physics",
      "Political Science",
      "Psychology",
      "Sangeet",
      "Sociology",
    ].sort(),
    XII: [
      "Accountancy",
      "Biology",
      "Business Studies",
      "Chemistry",
      "Computer Science",
      "Creative Writing & Translation",
      "Economics",
      "English",
      "Fine Art",
      "Geography",
      "History",
      "Home Science",
      "Informatics Practices",
      "Mathematics",
      "Physics",
      "Political Science",
      "Psychology",
      "Sangeet",
      "Sociology",
    ].sort(),
  };

  const books = {
    Mathematics: ["Mathematics Book 1", "Mathematics Book 2", "Mathematics Workbook"],
    English: ["English Grammar", "English Reader", "Creative Writing"],
    Hindi: ["Hindi Pathmala", "Hindi Vyakaran", "Hindi Kavita"],
    Science: ["Science Textbook", "Science Experiments", "Fun with Science"],
    "Social Science": ["Social Studies Workbook", "World Cultures", "History Basics"],
    History: ["Ancient History", "Medieval History", "Modern History"],
    Geography: ["World Atlas", "Physical Geography", "Human Geography"],
    "Environmental Studies": ["Environmental Basics", "Nature and Us", "Eco Science"],
    "Health and Physical Education": [
      "Healthy Living",
      "Physical Activities",
      "Sports Science",
    ],
    "Information and Communication Technology": [
      "ICT Basics",
      "Digital Literacy",
      "Tech Innovations",
    ],
    Sanskrit: ["Sanskrit Grammar", "Sanskrit Sahitya", "Sanskrit Pathmala"],
    "Vocational Education": ["Skill Development", "Career Paths", "Vocational Excellence"],
    Arts: ["Creative Arts", "Painting Techniques", "Sculpture Basics"],
    "Physical Education and Wellbeing": ["Mind and Body", "Fitness Guide", "Wellbeing 101"],
    "The World Around Us": ["Exploring Our World", "Nature Wonders", "Global Insights"],
    Accountancy: ["Financial Accounting Basics", "Advanced Accounting", "Taxation Guide"],
    Biology: ["Biology Textbook", "Plant and Animal Life", "Genetics Fundamentals"],
    "Business Studies": ["Introduction to Business", "Management Practices", "Corporate Strategies"],
    Chemistry: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry"],
    "Computer Science": ["Programming Basics", "Data Structures", "Computer Architecture"],
    "Creative Writing & Translation": [
      "Writing Techniques",
      "Art of Translation",
      "Storytelling Basics",
    ],
    Economics: ["Microeconomics", "Macroeconomics", "International Trade"],
    "Fine Art": ["History of Art", "Drawing and Painting", "Sculpture Design"],
    "Home Science": ["Nutrition and Health", "Textile Science", "Home Management"],
    "Informatics Practices": ["Database Management", "Python Programming", "Web Development"],
    Physics: ["Mechanics", "Electrodynamics", "Quantum Physics"],
    "Political Science": ["Indian Polity", "Political Theories", "World Politics"],
    Psychology: ["Cognitive Psychology", "Social Psychology", "Developmental Psychology"],
    Sangeet: ["Classical Music Theory", "Instruments Basics", "Vocal Training"],
    Sociology: ["Introduction to Sociology", "Social Theories", "Cultural Studies"],
  };
  // Your existing subjects and books data...
  
  const handleClassChange = (cls) => {
    setSelectedClass(cls);
    setSelectedSubject("");
    setSelectedBookTitle("");
    setPdfUrl("");
    setShowPdfViewer(false);
  };

  const handleSubjectChange = (subject) => {
    setSelectedSubject(subject);
    setSelectedBookTitle("");
    setPdfUrl("");
    setShowPdfViewer(false);
  };

  const handleBookTitleChange = (title) => {
    setSelectedBookTitle(title);
    const pdfPath = `/pdfs/${selectedClass}/${selectedSubject}/${title}.pdf`;
    setPdfUrl(pdfPath);
    setShowPdfViewer(false);
  };

  const handleSearchClick = () => {
    if (pdfUrl) {
      setShowPdfViewer(true);
    }
  };

  // If PDF viewer is shown, render it with the PDF URL
  if (showPdfViewer) {
    return <PDFViewer fileUrl={pdfUrl} />;
  }

  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: "url('/images/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container
        maxWidth="lg"
        style={{
          padding: "70px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: "15px",
          boxShadow: "0px 30px 80px rgba(0, 0, 0, 0.4)",
          position: "relative",
        }}
      >
        <Box
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => history.push("/dashboard")}
            style={{
              backgroundColor: "#1976d2",
              fontSize: "16px",
              fontWeight: "600",
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            Back
          </Button>
        </Box>

        <Typography
          variant="h4"
          gutterBottom
          style={{
            color: "#333333",
            fontWeight: "700",
            fontFamily: "'Montserrat', sans-serif",
            textAlign: "center",
          }}
        >
          Search for Books
        </Typography>
        <Typography
          variant="body1"
          style={{
            marginBottom: "30px",
            color: "#555555",
            fontFamily: "'Roboto', serif",
            textAlign: "center",
          }}
        >
          Find books by class, subject, or title.
        </Typography>

        
        <Box display="flex" alignItems="center" gap="20px" width="100%" flexWrap="wrap">
          <FormControl style={{ width: "30%" }}>
            <InputLabel>Class</InputLabel>
            <Select
              value={selectedClass}
              onChange={(e) => handleClassChange(e.target.value)}
              label="Class"
            >
              {[
                "I",
                "II",
                "III",
                "IV",
                "V",
                "VI",
                "VII",
                "VIII",
                "IX",
                "X",
                "XI",
                "XII",
              ].map((cls) => (
                <MenuItem key={cls} value={cls}>
                  Class {cls}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

         
          <FormControl style={{ width: "30%" }} disabled={!selectedClass}>
            <InputLabel>Subject</InputLabel>
            <Select
              value={selectedSubject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              label="Subject"
            >
              {(subjects[selectedClass] || []).map((subject) => (
                <MenuItem key={subject} value={subject}>
                  {subject}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

           
          <FormControl style={{ width: "30%" }} disabled={!selectedSubject}>
            <InputLabel>Book Title</InputLabel>
            <Select
              value={selectedBookTitle}
              onChange={(e) => handleBookTitleChange(e.target.value)}
              label="Book Title"
            >
              {(books[selectedSubject] || []).map((title) => (
                <MenuItem key={title} value={title}>
                  {title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box> 
        {/* Rest of your form controls... */}
        
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSearchClick}
          style={{
            marginTop: "20px",
            backgroundColor: "#1976d2",
            fontSize: "16px",
            fontWeight: "600",
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          Search
        </Button>
      </Container>
    </div>
  );
};

export default SearchBooks;
