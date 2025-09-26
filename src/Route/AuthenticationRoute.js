const express = require('express');
const { login } = require('../Controller/LoginController');
const { logout } = require('../Controller/LogoutController');
const { authenticateToken } = require('../Function/Authentication');

const router = express.Router();

router.post('/login', login);
router.post('/logout', authenticateToken, logout);

module.exports = router;

const { createUser } = require("../Controller/CreateUserController");

router.post("/register", createUser);
