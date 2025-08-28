const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  refreshToken
} = require('../controllers/authController');

const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validation');
const {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  resetPasswordRequestSchema,
  resetPasswordSchema,
  updateProfileSchema
} = require('../utils/validation');

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth routes
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later'
  }
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    message: 'Too many password reset attempts, please try again later'
  }
});

// Public routes
router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', validate(refreshTokenSchema), refreshToken);
router.post('/reset-password', passwordResetLimiter, validate(resetPasswordRequestSchema), forgotPassword);
router.post('/reset-password/:resettoken', validate(resetPasswordSchema), resetPassword);

// Protected routes
router.post('/logout', protect, logout);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, validate(updateProfileSchema), updateProfile);

module.exports = router;
