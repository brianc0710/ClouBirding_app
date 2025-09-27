const {
  CognitoIdentityProviderClient,
  SignUpCommand,
  ConfirmSignUpCommand,
  InitiateAuthCommand
} = require("@aws-sdk/client-cognito-identity-provider");
const crypto = require("crypto");

const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

function generateSecretHash(username, clientId, clientSecret) {
  return crypto
    .createHmac("SHA256", clientSecret)
    .update(username + clientId)
    .digest("base64");
}

// Register
const register = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const command = new SignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: username,
      Password: password,
      SecretHash: generateSecretHash(
        username,
        process.env.COGNITO_CLIENT_ID,
        process.env.COGNITO_CLIENT_SECRET
      ),
      UserAttributes: [{ Name: "email", Value: email }]
    });
    const response = await client.send(command);
    res.status(201).json({ success: true, message: "User created", data: response });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// Confirm user
const confirm = async (req, res) => {
  const { username, code } = req.body;
  try {
    const command = new ConfirmSignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: username,
      ConfirmationCode: code,
      SecretHash: generateSecretHash(
        username,
        process.env.COGNITO_CLIENT_ID,
        process.env.COGNITO_CLIENT_SECRET
      )
    });
    await client.send(command);
    res.json({ success: true, message: "User confirmed successfully" });
  } catch (err) {
    console.error("Confirm error:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// Login
const login = async (req, res) => {
  const { username, password } = req.body;
  console.log("🟢 Login request:", { username, password }); // Debug log

  // ✅ Hardcode testing account
  const testUser = {
    username: "testuser",
    password: "testpass",
    role: "tester"
  };

  // If matches hardcode, return fake token
  if (username === testUser.username && password === testUser.password) {
    console.log("✅ Hardcoded login triggered!");
    const fakeToken = "FAKE.JWT.TOKEN";
    return res.json({
      success: true,
      message: "Hardcoded login successful",
      data: {
        token: fakeToken,
        user: { username: testUser.username, role: testUser.role }
      }
    });
  }

  // Else go Cognito
  try {
    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        SECRET_HASH: generateSecretHash(
          username,
          process.env.COGNITO_CLIENT_ID,
          process.env.COGNITO_CLIENT_SECRET
        )
      }
    });
    const response = await client.send(command);
    res.json({
      success: true,
      message: "Login successful",
      data: {
        token: response.AuthenticationResult.IdToken,
        user: { username }
      }
    });
  } catch (err) {
    console.error("❌ Cognito Login error:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = { register, confirm, login };
