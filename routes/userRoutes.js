const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { register, deleteAccount, login, getCurrentUser } = require("../controllers/UserController");
const router = express.Router();

// Register a new user
router.post("/register", register);

// Login user
router.post("/login", login);

// Fetch user info (requires authentication)
router.get("/me", authMiddleware, getCurrentUser);

// Delete user account (requires authentication)
router.delete("/delete-account", authMiddleware, deleteAccount);

module.exports = router;
