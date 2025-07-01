const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const videoRoutes = require("./videoRoutes");
const userRoutes = require("./userRoutes");
const loginRoutes = require("./login");
const softwareRoutes = require("./softwareRoutes");
const commentsRoutes = require("./commentsRoutes");





const app = express();
app.use(cors());

app.use(express.json());

app.use("/api/videos", videoRoutes);
app.use("/api", softwareRoutes);
app.use("/api", commentsRoutes);

app.use(userRoutes);
app.use(loginRoutes);

// Create upload folder if not exists
["cash", "trade", "fx"].forEach((folder) => {
  const dir = path.join(__dirname, "uploads", folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Dynamic folder based on category
/*const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const category = req.params.category;
    const uploadPath = path.join(__dirname, "uploads", category);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});*/


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const category = req.params.category; // e.g., cash, trade, fx
    const folderPath = path.join(__dirname, "uploads", category);
    fs.mkdirSync(folderPath, { recursive: true });
    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    const randomName = uuidv4(); // generate random ID
    cb(null, randomName); // no .mp4 extension
  },
});



const upload = multer({ storage });

app.post("/upload/:category", upload.single("file"), (req, res) => {
  //res.json({ message: "Upload successful" });
  const category = req.body.category;
  const filename = req.file.filename;

  res.json({
    success: true,
    message: "Video uploaded",
    filename,
    category,
    url: `/videos/${category}/${filename}`, // custom stream endpoint
  });
});

app.get("/videos/:category", (req, res) => {
  const category = req.params.category;
  const dir = path.join(__dirname, "uploads", category);

  fs.readdir(dir, (err, files) => {
    if (err) return res.status(500).json({ error: "Cannot read directory" });

   /* const videos = files
      .filter(f => f !== ".DS_Store")
      .map(file => ({
        title: file.split("-").slice(1).join("-"), // Remove timestamp prefix
        filename: file,
        url: `http://localhost:5000/uploads/${category}/${file}`,
        uploadedAt: fs.statSync(path.join(dir, file)).mtime
      }))
      .sort((a, b) => b.uploadedAt - a.uploadedAt); // Sort by latest*/
   const videos = getVideoFromFolder(category);
    res.json(videos);
  });
});


// Serve static videos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Delete video
app.delete("/delete/:category/:filename", (req, res) => {
  const { category, filename } = req.params;
  const filePath = path.join(__dirname, "uploads", category, filename);

  fs.unlink(filePath, (err) => {
    if (err) return res.status(500).json({ error: "Delete failed" });
    res.sendStatus(200);
  });
});


const getVideoFromFolder = (folderName) => {
  const folderPath = path.join(__dirname, "uploads", folderName);
  if (!fs.existsSync(folderPath)) {
    console.warn(`⚠️ Folder not found: ${folderPath}`);
    return [];
  }

  return fs.readdirSync(folderPath).map((filename) => ({
    title: path.parse(filename).name,
    description: `Video from ${folderName}`,
    url: `http://localhost:5000/uploads/${folderName}/${filename}`,
    filename,
    category: folderName,
    uploadedAt: fs.statSync(path.join(folderPath, filename)).birthtime,
    views: Math.floor(Math.random() * 1000), // optional placeholder
    likes: Math.floor(Math.random() * 100),  // optional placeholder
  })).sort((a, b) => b.uploadedAt - a.uploadedAt); // Sort by latest*/
};

/* USER management */




const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
