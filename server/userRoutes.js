const express = require("express");
const router = express.Router();
const { getAllAdmins, addAdmin, deleteAdmin, toggleAdminStatus} = require("./userController");

// Simulated auth middleware to allow only superadmin
const requireSuperAdmin = (req, res, next) => {
  const user = req.headers["x-user-role"]; // Use real auth in production!
  if (user !== "superadmin") return res.status(403).json({ message: "Forbidden" });
  next();
};

router.get("/api/users", requireSuperAdmin, (req, res) => {
  try {
    const admins = getAllAdmins();
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/api/users", requireSuperAdmin, (req, res) => {
  try {
     console.log("Incoming user:", req.body); // log to check
    addAdmin(req.body);
    res.status(201).json({ message: "Admin created" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/api/users/:email", requireSuperAdmin, (req, res) => {
  try {
    deleteAdmin(req.params.email);
    res.json({ message: "Admin deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch("/api/users/:email/toggle", requireSuperAdmin, (req, res) => {
  try {
    const status = toggleAdminStatus(req.params.email);
    res.json({ message: `Admin status updated to ${status}` });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
