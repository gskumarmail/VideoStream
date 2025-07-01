const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const filePath = path.join(__dirname, "software.json");

// Read all data
router.get("/software", (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  res.json(data);
});

// Add new software
router.post("/software", (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  const newEntry = { id: Date.now().toString(), ...req.body };
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.status(201).json(newEntry);
});

// Edit software by ID
router.put("/software/:id", (req, res) => {
  const { id } = req.params;
  let data = JSON.parse(fs.readFileSync(filePath));
  const index = data.findIndex((entry) => entry.id === id);

  if (index === -1) return res.status(404).send("Entry not found");

  data[index] = { ...data[index], ...req.body };
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.json(data[index]);
});

// Delete software by ID
router.delete("/software/:id", (req, res) => {
  const { id } = req.params;
  let data = JSON.parse(fs.readFileSync(filePath));
  data = data.filter((entry) => entry.id !== id);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.json({ success: true });
});

module.exports = router;
