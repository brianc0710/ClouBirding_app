const express = require('express');
const { upload } = require('../Controller/UploadController');
const { handleFileUpload } = require('../Function/FileUpload');
const { authenticateToken }= require('../Function/Authentication');

const router = express.Router();

router.post('/upload', authenticateToken, handleFileUpload, upload);

const { saveObservation } = require('../Controller/ObservationController');

router.post('/observation', authenticateToken, saveObservation);


module.exports = router;