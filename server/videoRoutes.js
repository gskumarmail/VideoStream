const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const baseDir = path.join(__dirname, "uploads");


// Multer config to upload and overwrite existing file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const category = req.params.category;
    const dir = path.join(__dirname, "uploads", category);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, req.params.filename); // Keep same filename
  },
});

const upload = multer({ storage });

/*router.put("/edit/:category/:filename", upload.single("file"), (req, res) => {
  const { category, filename } = req.params;
  const { title, description } = req.body;

  const folderPath = path.join(__dirname, "uploads", category);
  console.log(folderPath);
  /*const metaPath = path.join(folderPath, "metadata.json");

  // Ensure folder and metadata.json exist
  if (!fs.existsSync(metaPath)) {
    return res.status(404).json({ error: "Metadata not found" });
  }

  let metadata = JSON.parse(fs.readFileSync(metaPath));

  const index = metadata.findIndex((v) => v.filename === filename);
  if (index === -1) {
    return res.status(404).json({ error: "Video not found in metadata" });
  }

  metadata[index].title = title;
  metadata[index].description = description;
  metadata[index].updatedAt = new Date().toISOString();

  fs.writeFileSync(metaPath, JSON.stringify(metadata, null, 2));*/

  /*return res.json({ message: "Video updated successfully" });
}); */

router.put("/edit/:category/:filename", upload.single("file"), (req, res) => {
  const { category, filename } = req.params;
  const { title, description } = req.body;

  const folderPath = path.join(__dirname, "uploads", category);
  const metaPath = path.join(baseDir, "metadata.json");
  console.log("File uploaded:", req.file);
  let metadata = [];

  if (fs.existsSync(metaPath)) {
    try {
      metadata = JSON.parse(fs.readFileSync(metaPath));
    } catch (err) {
      return res.status(500).json({ error: "Failed to read metadata" });
    }
  }

  const index = metadata.findIndex((v) => v.filename === filename);

  if (index !== -1) {
    metadata[index].title = title;
    metadata[index].description = description;
    metadata[index].updatedAt = new Date().toISOString();
  } else {
    // Create new metadata if not exists
    metadata.push({
      filename,
      title,
      description,
      category,
      uploadedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
    });
  }

  try {
    fs.writeFileSync(metaPath, JSON.stringify(metadata, null, 2));
    return res.json({ message: "Video updated successfully" });
  } catch (err) {
    console.error("Failed to write metadata:", err);
    return res.status(500).json({ error: "Failed to save metadata" });
  }
});


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

  // Add Cache-Control headers
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");

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
      // Add Cache-Control headers
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");

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

router.get("/report", (req, res) => {
return res.json([
        {
            "category": "cash",
            "totalVideos": 10,
            "totalLikes": 35,
            "totalViews": 500,
            "totalComments": 12
        },
        {
            "category": "trade",
            "totalVideos": 8,
            "totalLikes": 20,
            "totalViews": 300,
            "totalComments": 7
        },
         {
            "category": "fx",
            "totalVideos": 3,
            "totalLikes": 20,
            "totalViews": 400,
            "totalComments": 25
        },
         {
            "category": "All Status",
            "totalVideos": 3,
            "totalLikes": 20,
            "totalViews": 400,
            "totalComments": 25
        }
    ]
);
});

/*router.put('/videos/:filename', upload.single('file'), (req, res) => {
  const filename = req.params.filename;
  const { title, description } = req.body;
  const videoPath = path.join(__dirname, '../uploads/{category}', filename); // derive folder

  // update metadata file if you use a JSON/DB store
  // optionally replace file if req.file is present
});
*/

module.exports = router;
