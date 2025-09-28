const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const memcached = require("../cache/memcached");

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const TABLE_NAME = "10820566CloudBirdingObservations";

// Get species list with cache
const getSpeciesList = async (req, res) => {
  const cacheKey = "speciesList";

  try {
    // 1. Try cache
    let cached = await memcached.aGet(cacheKey);
    if (cached) {
      console.log("Cache hit");
      return res.json(JSON.parse(cached));
    }

    // 2. Query DynamoDB
    console.log("Cache miss → fetching from DynamoDB");
    const params = { TableName: TABLE_NAME, ProjectionExpression: "species" };
    const data = await dynamoClient.send(new ScanCommand(params));

    const speciesSet = new Set(data.Items.map((i) => i.species.S));
    const speciesList = Array.from(speciesSet);

    // 3. Store in cache (TTL 60 sec)
    await memcached.aSet(cacheKey, JSON.stringify(speciesList), 60);

    res.json(speciesList);
  } catch (err) {
    console.error("Error fetching species list:", err);
    res.status(500).json({ error: "Failed to fetch species list" });
  }
};

module.exports = { getSpeciesList };
