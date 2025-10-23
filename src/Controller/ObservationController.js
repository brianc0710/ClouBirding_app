const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs"); 
const { v4: uuidv4 } = require("uuid");

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const sqsClient = new SQSClient({ region: process.env.AWS_REGION }); 

const TABLE_NAME = "10820566CloudBirdingObservations";
const QUEUE_URL = "https://sqs.ap-southeast-2.amazonaws.com/901444280953/n10820566-ClouBirding-queue"; 

const saveObservation = async (req, res) => {
    try {
        const { species, year, month, day, location, comment, fileURL } = req.body;
        const userId = req.user?.id || "anonymous";

        const observationId = uuidv4();
        const time = `${year}-${month}-${day}`;
        const createdAt = new Date().toISOString();

        const params = {
            TableName: TABLE_NAME,
            Item: {
                observationId: { S: observationId },
                userId: { S: userId },
                species: { S: species },
                time: { S: time },
                location: { S: location },
                comment: { S: comment },
                fileUrl: { S: fileURL },
                createdAt: { S: createdAt },
            },
        };

        console.log("Saving observation:", params);
        await dynamoClient.send(new PutItemCommand(params));

        // 🔹 Send message to SQS after successful save
        const message = {
            observationId,
            userId,
            species,
            location,
            comment,
            fileURL,
            createdAt,
        };

        try {
            const command = new SendMessageCommand({
                QueueUrl: QUEUE_URL,
                MessageBody: JSON.stringify(message),
            });
            await sqsClient.send(command);
            console.log("✅ Sent message to SQS:", message);
        } catch (sqsErr) {
            console.error("❌ Failed to send message to SQS:", sqsErr);
        }

        console.log("Saved successfully:", observationId);
        res.status(200).json({
            success: true,
            message: "Observation saved",
            observationId: observationId
        });
    } catch (err) {
        console.error("Error saving observation:", err);
        res.status(500).json({
            success: false,
            message: "Failed to save observation"
        });
    }
};

module.exports = { saveObservation };
