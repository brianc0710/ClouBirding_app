const express = require("express");
const { signup, confirm, login } = require("../Controller/AuthenticationController");
const { logout } = require("../Controller/LogoutController");

const router = express.Router();

router.post("/register", (req, res) => {
  res.status(501).json({ message: "Register via Cognito not implemented yet" });
});

router.post("/login", (req, res) => {
  res.status(501).json({ message: "Login via Cognito not implemented yet" });
});

// Logout
router.post("/logout", authenticateToken, logout);

module.exports = router;
