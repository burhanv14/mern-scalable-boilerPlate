// Simple test to verify the backend setup
const mongoose = require('mongoose');

console.log('🚀 MERN Scalable Boilerplate - Backend Setup Test');
console.log('================================================');

// Test 1: Check if all required packages are installed
console.log('\n✅ Testing package imports...');
try {
  require('express');
  require('mongoose');
  require('bcryptjs');
  require('jsonwebtoken');
  require('joi');
  require('cors');
  require('dotenv');
  require('nodemailer');
  require('express-rate-limit');
  require('helmet');
  console.log('✅ All required packages are installed successfully!');
} catch (error) {
  console.log('❌ Missing package:', error.message);
  process.exit(1);
}

// Test 2: Check environment configuration
console.log('\n✅ Testing environment configuration...');
require('dotenv').config();

const requiredEnvVars = [
  'PORT',
  'MONGO_URI', 
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'CLIENT_URL'
];

const missingVars = [];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    missingVars.push(varName);
  }
});

if (missingVars.length > 0) {
  console.log('⚠️  Missing environment variables:', missingVars.join(', '));
  console.log('   Please update your .env file with these variables.');
} else {
  console.log('✅ All required environment variables are configured!');
}

// Test 3: Test app initialization
console.log('\n✅ Testing app initialization...');
try {
  const app = require('./src/app');
  console.log('✅ Express app initialized successfully!');
} catch (error) {
  console.log('❌ App initialization failed:', error.message);
  process.exit(1);
}

console.log('\n🎉 Backend setup verification completed!');
console.log('\n📝 Next steps:');
console.log('1. Update your .env file with actual values');
console.log('2. Start MongoDB service');
console.log('3. Configure email service credentials');
console.log('4. Run: npm start');

console.log('\n📚 API Endpoints:');
console.log('POST /api/auth/register - User registration');
console.log('POST /api/auth/login - User login');
console.log('POST /api/auth/refresh - Refresh token');
console.log('POST /api/auth/logout - User logout');
console.log('GET  /api/auth/profile - Get user profile');
console.log('PUT  /api/auth/profile - Update user profile');
console.log('POST /api/auth/reset-password - Request password reset');
console.log('POST /api/auth/reset-password/:token - Reset password');
console.log('GET  /api/health - Health check');
