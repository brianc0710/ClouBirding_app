const express = require("express");
const { sendObservationMessage, receiveMessages } = require("../Controller/SQSController");
const router = express.Router();

router.post("/sqs/send", sendObservationMessage);
router.get("/sqs/receive", receiveMessages);

module.exports = router;
