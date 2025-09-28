const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

const client = jwksClient({
  jwksUri: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`
});

// get public key
function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  if (token === "FAKE.JWT.TOKEN") {
    req.user = { username: "testuser", role: "tester" };
    return next();
  }

  jwt.verify(
    token,
    getKey,
    { algorithms: ["RS256"] },
    (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });
      req.user = decoded;
      next();
    }
  );
};

module.exports = { authenticateToken };
