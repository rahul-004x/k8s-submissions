const express = require("express");
const path = require("path");
const axios = require("axios");
const fs = require("fs-extra");
const app = express();
require("dotenv").config();

// In-memory todo storage
let todos = [];
let nextTodoId = 1;

// Ensure cache directory exists
const CACHE_DIR = path.join(__dirname, "cache", "images");
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

fs.ensureDirSync(CACHE_DIR);

app.use(express.json());
app.use("/cache", express.static(path.join(__dirname, "cache")));
app.use(express.static(path.join(__dirname, "public")));

// Image cache management
let currentImageData = {
  filename: null,
  timestamp: null,
  path: null,
};

async function fetchAndCacheImage() {
  try {
    console.log("Fetching new image from Lorem Picsum...");

    // Generate a unique filename with timestamp
    const timestamp = Date.now();
    const filename = `image_${timestamp}.jpg`;
    const imagePath = path.join(CACHE_DIR, filename);

    // Fetch image from Lorem Picsum
    const response = await axios({
      method: "GET",
      url: "https://picsum.photos/1200",
      responseType: "stream",
    });

    // Save image to cache directory
    const writer = fs.createWriteStream(imagePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", () => {
        console.log(`Image cached: ${filename}`);
        resolve({
          filename,
          timestamp,
          path: imagePath,
        });
      });
      writer.on("error", reject);
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    throw error;
  }
}

async function getCurrentImage() {
  const now = Date.now();

  // Check if we need a new image (no current image or cache expired)
  if (
    !currentImageData.timestamp ||
    now - currentImageData.timestamp > CACHE_DURATION
  ) {
    try {
      // Clean up old image files (keep only the latest 5)
      const files = await fs.readdir(CACHE_DIR);
      const imageFiles = files.filter((f) => f.startsWith("image_")).sort();
      if (imageFiles.length > 5) {
        for (let i = 0; i < imageFiles.length - 5; i++) {
          await fs.remove(path.join(CACHE_DIR, imageFiles[i]));
        }
      }

      // Fetch new image
      currentImageData = await fetchAndCacheImage();
    } catch (error) {
      console.error("Failed to fetch new image, using existing if available");
      // If we can't fetch a new image but have an existing one, keep using it
      if (!currentImageData.filename) {
        throw new Error(
          "No cached image available and unable to fetch new one",
        );
      }
    }
  }

  return currentImageData;
}

// API endpoint to get current image
app.get("/api/image", async (req, res) => {
  try {
    const imageData = await getCurrentImage();
    res.json({
      imageUrl: `/cache/images/${imageData.filename}`,
      timestamp: imageData.timestamp,
      cacheAge: Date.now() - imageData.timestamp,
      nextRefresh: CACHE_DURATION - (Date.now() - imageData.timestamp),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get image" });
  }
});

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// Initialize with first image on startup
// getCurrentImage().catch(console.error);
//
// app.post("/", (_req, res) => { });

// Todo API endpoints
app.get("/todos", (req, res) => {
  res.json(todos);
});

app.post("/todos", (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== "string" || text.trim() === "") {
    return res.status(400).json({ error: "Todo text is required" });
  }

  const newTodo = {
    id: nextTodoId++,
    text: text.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
  console.log(`Cache directory: ${CACHE_DIR}`);
});
