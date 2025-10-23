const { SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand } = require("@aws-sdk/client-sqs");
const { sqsClient } = require("../sqsClient");

const QUEUE_URL = "https://sqs.ap-southeast-2.amazonaws.com/901444280953/n10820566-ClouBirding-queue";

// Producer
const sendObservationMessage = async (req, res) => {
  try {
    const { species, location, comment } = req.body;

    const message = {
      species,
      location,
      comment,
      timestamp: new Date().toISOString(),
    };

    const command = new SendMessageCommand({
      QueueUrl: QUEUE_URL,
      MessageBody: JSON.stringify(message),
    });

    await sqsClient.send(command);

    res.status(200).json({ success: true, message: "Message sent to SQS successfully" });
  } catch (err) {
    console.error("SQS send error:", err);
    res.status(500).json({ success: false, error: "Failed to send SQS message" });
  }
};

// Consumer
const receiveMessages = async (req, res) => {
  try {
    const command = new ReceiveMessageCommand({
      QueueUrl: QUEUE_URL,
      MaxNumberOfMessages: 5,
      WaitTimeSeconds: 5,
    });

    const data = await sqsClient.send(command);

    if (!data.Messages || data.Messages.length === 0) {
      return res.status(200).json({ message: "No messages available" });
    }

    // delete message
    for (const msg of data.Messages) {
      console.log("Received:", msg.Body);

      const deleteCommand = new DeleteMessageCommand({
        QueueUrl: QUEUE_URL,
        ReceiptHandle: msg.ReceiptHandle,
      });

      await sqsClient.send(deleteCommand);
    }

    res.status(200).json({ success: true, messages: data.Messages.map(m => JSON.parse(m.Body)) });
  } catch (err) {
    console.error("SQS receive error:", err);
    res.status(500).json({ success: false, error: "Failed to receive SQS messages" });
  }
};

module.exports = { sendObservationMessage, receiveMessages };
