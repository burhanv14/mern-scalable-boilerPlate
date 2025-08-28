const crypto = require('crypto');

// Generate random string
exports.generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Generate secure token
exports.generateSecureToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

// Hash token
exports.hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// Generate OTP
exports.generateOTP = (length = 6) => {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};
