const {
  CognitoIdentityProviderClient,
  SignUpCommand,
  ConfirmSignUpCommand,
  InitiateAuthCommand
} = require("@aws-sdk/client-cognito-identity-provider");

const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

const signup = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const command = new SignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: username,
      Password: password,
      UserAttributes: [{ Name: "email", Value: email }]
    });
    const response = await client.send(command);
    res.status(201).json({ success: true, message: "User created", data: response });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

const confirm = async (req, res) => {
  const { username, code } = req.body;
  try {
    const command = new ConfirmSignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: username,
      ConfirmationCode: code
    });
    await client.send(command);
    res.json({ success: true, message: "User confirmed successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password
      }
    });
    const response = await client.send(command);
    res.json({
      success: true,
      message: "Login successful",
      data: {
        token: response.AuthenticationResult.IdToken
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = { signup, confirm, login };
