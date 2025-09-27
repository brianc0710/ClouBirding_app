const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");

const client = new SSMClient({ region: process.env.AWS_REGION });

async function getParameter(name) {
  try {
    const response = await client.send(
      new GetParameterCommand({
        Name: name,
        WithDecryption: false,
      })
    );
    return response.Parameter.Value;
  } catch (err) {
    console.error(`Error fetching parameter ${name}:`, err);
    throw err;
  }
}

module.exports = { getParameter };
