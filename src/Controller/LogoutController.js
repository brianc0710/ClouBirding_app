const { CognitoIdentityProviderClient, GlobalSignOutCommand } = require("@aws-sdk/client-cognito-identity-provider");

const logout = async (req, res) => {
  try {

    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to logout",
      error: error.message
    });
  }
};

module.exports = { logout };
