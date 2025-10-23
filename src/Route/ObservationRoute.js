const express = require("express");
const { authenticateToken } = require("../Function/Authentication");
const { saveObservation } = require("../Controller/ObservationController");

const router = express.Router();

// POST /api/observations
router.post("/", authenticateToken, saveObservation);

module.exports = router;
