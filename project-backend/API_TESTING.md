# API Testing Guide

This file contains example API calls for testing the authentication endpoints.

## Base URL
```
http://localhost:5000/api
```

## 1. Health Check
```bash
curl -X GET http://localhost:5000/api/health
```

## 2. User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com", 
    "password": "SecurePass123!"
  }'
```

## 3. User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

## 4. Get User Profile
```bash
# Replace YOUR_JWT_TOKEN with the token from login response
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 5. Update User Profile
```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith"
  }'
```

## 6. Refresh Token
```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## 7. Request Password Reset
```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

## 8. Reset Password
```bash
# Replace RESET_TOKEN with the token from the reset email
curl -X POST http://localhost:5000/api/auth/reset-password/RESET_TOKEN \
  -H "Content-Type: application/json" \
  -d '{
    "password": "NewSecurePass123!"
  }'
```

## 9. Logout
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## Testing with Postman

Import these endpoints into Postman for easier testing:

1. Create a new collection called "MERN Auth API"
2. Set a collection variable `baseUrl` = `http://localhost:5000/api`
3. Set collection variables for `token` and `refreshToken` after login
4. Use `{{baseUrl}}` and `{{token}}` in your requests

## Response Format

All responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## Status Codes

- `200` - Success
- `201` - Created (registration)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials/token)
- `403` - Forbidden (insufficient permissions)
- `429` - Too Many Requests (rate limiting)
- `500` - Internal Server Error
