// Controller/ObservationController.js
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { v4: uuidv4 } = require("uuid");

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const TABLE_NAME = process.env.DYNAMO_TABLE;

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

        await dynamoClient.send(new PutItemCommand(params));
        res.json({ message: "Observation saved", observationId });
    } catch (err) {
        console.error("Error saving observation:", err);
        res.status(500).json({ message: "Failed to save observation" });
    }
};

module.exports = { saveObservation };
