const express = require("express");
const { signup, confirm, login } = require("../Controller/AuthenticationController");
const { logout } = require("../Controller/LogoutController");
const { authenticateToken } = require("../Function/Authentication"); 
const router = express.Router();

router.post("/signup", signup);

router.post("/confirm", confirm);

router.post("/login", login);

router.post("/logout", authenticateToken, logout);

module.exports = router;
