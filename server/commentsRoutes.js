const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const COMMENTS_FILE = path.join(__dirname, "comments.json");

// Helper to read comments
const readComments = () => {
  if (!fs.existsSync(COMMENTS_FILE)) fs.writeFileSync(COMMENTS_FILE, "[]");
  const data = fs.readFileSync(COMMENTS_FILE, "utf-8");
  return JSON.parse(data);
};

// Helper to write comments
const writeComments = (comments) => {
  fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));
};

// GET: List comments for a video
router.get("/comments/:videoId", (req, res) => {
  const videoId = req.params.videoId;
  const comments = readComments();
  const videoComments = comments.filter((c) => c.videoId === videoId);
  res.json(videoComments);
});

// POST: Add new comment
router.post("/comments", express.json(), (req, res) => {
  const { videoId, author, text } = req.body;
  if (!videoId || !text) {
    return res.status(400).json({ error: "videoId and text are required" });
  }

  const comments = readComments();
  const newComment = {
    id: Date.now().toString(),
    videoId,
    author: author || "Anonymous",
    text,
    likes: 0,
    date: new Date().toISOString(),
  };

  comments.push(newComment);
  writeComments(comments);
  res.status(201).json(newComment);
});

// POST: Like a comment
router.post("/comments/:id/like", (req, res) => {
  const commentId = req.params.id;
  const comments = readComments();
  const index = comments.findIndex((c) => c.id === commentId);

  if (index === -1) {
    return res.status(404).json({ error: "Comment not found" });
  }

  comments[index].likes = (comments[index].likes || 0) + 1;
  writeComments(comments);
  res.json(comments[index]);
});

module.exports = router;
