const express = require("express");
const { register, confirm, login } = require("../Controller/AuthenticationController");
const { logout } = require("../Controller/LogoutController");
const { authenticateToken } = require("../Function/Authentication"); 
const router = express.Router();

router.post("/register", register); 
router.post("/admin-register", adminRegister);
router.post("/confirm", confirm);
router.post("/login", login);
router.post("/logout", authenticateToken, logout);

module.exports = router;
