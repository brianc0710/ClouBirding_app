const express = require("express");
const { getSpeciesList } = require("../Controller/ObservationCacheController");

const router = express.Router();

// GET /api/species
router.get("/species", getSpeciesList);

module.exports = router;
