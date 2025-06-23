const express = require("express");
// const multer = require("multer");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const baseDir = path.join(__dirname, "uploads");

// const upload = multer({ storage });

/*const getVideosFromFolder = (folderName) => {
  const folderPath = path.join(baseDir, folderName);
  if (!fs.existsSync(folderPath)) return [];

  return fs.readdirSync(folderPath).map((filename) => ({
    title: path.parse(filename).name,
    description: `Video from ${folderName}`,
    url: `/uploads/${folderName}/${filename}`,
    filename,
    category: folderName,
    uploadedAt: fs.statSync(path.join(folderPath, filename)).birthtime,
    views: Math.floor(Math.random() * 1000), // placeholder
    likes: Math.floor(Math.random() * 100),  // placeholder
  }));
};*/

const getVideosFromFolder = (folderName) => {
  const folderPath = path.join(baseDir, folderName);
  console.log("Looking in:", folderPath);

  if (!fs.existsSync(folderPath)) {
    console.warn("Folder does not exist:", folderPath);
    return [];
  }

  const files = fs.readdirSync(folderPath);
  console.log(`Files in ${folderName}:`, files);

  return files.map((filename) => ({
    title: path.parse(filename).name,
    description: `Video from ${folderName}`,
    url: `http://localhost:5000/uploads/${folderName}/${filename}`,
    filename,
    category: folderName,
    uploadedAt: fs.statSync(path.join(folderPath, filename)).birthtime,
    views: Math.floor(Math.random() * 1000),
    likes: Math.floor(Math.random() * 100),
  }));
};





router.get("/stream/:category/:id", (req, res) => {
  const { category, id } = req.params;
  const filePath = path.join(__dirname, "uploads", category, id);

  // Validate file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Video not found");
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
});


router.get("/all", (req, res) => {
  try {
    const cashVideos = getVideosFromFolder("cash");
    const tradeVideos = getVideosFromFolder("trade");
    const fxVideos = getVideosFromFolder("fx");

    const allVideos = [...cashVideos, ...tradeVideos, ...fxVideos].sort(
      (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
    );

    res.json(allVideos);
  } catch (error) {
    console.error("Error fetching all videos:", error);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

module.exports = router;
