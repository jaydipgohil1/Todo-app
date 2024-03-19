const jwt = require('jsonwebtoken');

function generateToken(email) {
  return jwt.sign({ email }, 'secret', { expiresIn: '1h' });
}

module.exports = { generateToken };
