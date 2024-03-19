const jwt = require('jsonwebtoken');
const { secret } = require("../config/secretKey");

// Function to generate JWT token
function generateToken(email) {
  return jwt.sign({ email }, secret, { expiresIn: '1h' });
}

// Function to decode email from JWT token
function decodeToken(token) {
  try {
    const decoded = jwt.verify(token, secret); // Verify the token with your secret key
    const email = decoded.email; // Extract the email from the decoded token
    return email;
  } catch (error) {
    // Handle any errors, such as token expiration or invalid token
    console.error('Error decoding token:', error.message);
    return null;
  }
}

module.exports = { generateToken, decodeToken };
