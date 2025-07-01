// routes/login.js or inside your main server.js
const fs = require("fs");
const path = require("path");
const express = require("express");

const router = express.Router();
const usersPath = path.join(__dirname, "users.json");

router.post("/api/login", express.json(), (req, res) => {
  const { email, password } = req.body;
  const users = JSON.parse(fs.readFileSync(usersPath, "utf-8"));

  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  if (user.role === "admin" && user.status !== "active") {
    return res
      .status(403)
      .json({ message: "Account inactive. Contact your administrator." });
  }

  return res.json({
    username: user.username,
    role: user.role,
    email: user.email,
  });
});

module.exports = router;
