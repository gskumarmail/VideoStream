const fs = require("fs");
const path = require("path");

const userFile = path.join(__dirname, "users.json");
console.log(userFile);
function readUsers() {
  return JSON.parse(fs.readFileSync(userFile, "utf-8"));
}

function writeUsers(users) {
  fs.writeFileSync(userFile, JSON.stringify(users, null, 2), "utf-8");
}

function getAllAdmins() {
  const users = readUsers();
  return users;
  // return users.filter((u) => u.role === "admin");
}

function addAdmin({ username, email, password, role }) {
  if (!username || !email || !password) {
    throw new Error("All fields are required");
  }
  const users = readUsers();
  const exists = users.find((u) => u.email === email);
  if (exists) throw new Error("User already exists");

  users.push({ username, email, password, role, status:"active" });
  writeUsers(users);
}

function deleteAdmin(email) {
  const users = readUsers().filter((u) => u.email !== email);
  writeUsers(users);
}

function toggleAdminStatus(email) {
  const users = readUsers();
  const user = users.find((u) => u.email === email && u.role === "admin");
  if (!user) throw new Error("Admin not found");

  user.status = user.status === "active" ? "inactive" : "active";
  writeUsers(users);
  return user.status;
}


module.exports = {
  getAllAdmins,
  addAdmin,
  readUsers,
  writeUsers,
  deleteAdmin,
  toggleAdminStatus,
};
