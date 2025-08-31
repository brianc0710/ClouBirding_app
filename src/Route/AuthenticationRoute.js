const express = require('express');
const { login } = require('../Controller/LoginController');
const { logout } = require('../Controller/logoutController');
const { authenticateToken } = require('../Function/Authentication');

const router = express.Router();

router.post('/login', login);
router.post('/logout', authenticateToken, logout);

module.exports = router;
