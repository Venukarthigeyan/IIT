const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const path = require("path");

dotenv.config();
connectDB();

const app = express();
const OLLAMA_URL = "http://127.0.0.1:11434/api/generate";

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); // To parse JSON request bodies
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/user", userRoutes);

async function checkOllamaStatus() {
  try {
    // Dynamically import node-fetch
    const { default: fetch } = await import("node-fetch");

    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama2",
        prompt: "test",
        stream: false,
      }),
    });

    if (response.ok) {
      console.log("Successfully connected to Ollama");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Connection test failed:", error.message);
    return false;
  }
}

async function generateStreamResponse(res, model, prompt) {
  try {
    // Dynamically import node-fetch
    const { default: fetch } = await import("node-fetch");

    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt, stream: true }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    for await (const chunk of response.body) {
      const text = new TextDecoder().decode(chunk);
      const lines = text.split("\n").filter((line) => line.trim());

      for (const line of lines) {
        const data = JSON.parse(line);
        res.write(`data: ${JSON.stringify(data)}\n\n`);

        if (data.done) {
          res.end();
          return;
        }
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

app.post("/api/chat", async (req, res) => {
  const { prompt, stream = false } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required." });

  try {
    if (stream) {
      await generateStreamResponse(res, "llama2", prompt);
    } else {
      // Dynamically import node-fetch
      const { default: fetch } = await import("node-fetch");

      const response = await fetch(OLLAMA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "llama2", prompt, stream: false }),
      });
      const data = await response.json();
      res.json({ response: data.response });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to generate response." });
  }
});
const noteSchema = new mongoose.Schema({
  content: String,
  highlightAreas: [{
      height: Number,
      left: Number,
      pageIndex: Number,
      top: Number,
      width: Number
  }],
  quote: String,
  fileUrl: String,
  createdAt: { type: Date, default: Date.now }
});


const Note = mongoose.model('Note', noteSchema);

// Routes

// GET notes for a specific PDF
app.get('/api/notes', async (req, res) => {
  try {
      const fileUrl = req.query.fileUrl;
      const notes = await Note.find({ fileUrl }).sort({ createdAt: -1 });
      res.json(notes);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// POST new note
app.post('/api/notes', async (req, res) => {
  try {
      const note = new Note(req.body);
      const savedNote = await note.save();
      res.status(201).json(savedNote);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  const isOllamaRunning = await checkOllamaStatus();
  if (!isOllamaRunning) {
    console.error("Ollama is not running. Please start the service.");
  }
});
