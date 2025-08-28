# MERN Scalable Boilerplate - Backend

A robust Node.js/Express.js backend API with complete authentication system for the MERN stack boilerplate.

## 🚀 Features

- **Complete Authentication System**
  - User registration with email validation
  - Secure login with JWT tokens
  - Refresh token mechanism
  - Password reset via email
  - User profile management
  - Role-based access control (RBAC)

- **Security Features**
  - Password hashing with bcrypt
  - JWT token authentication
  - Rate limiting for API endpoints
  - CORS configuration
  - Helmet for security headers
  - Input validation with Joi

- **Email Integration**
  - Welcome emails for new users
  - Password reset emails
  - Nodemailer integration

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- Email service credentials (Gmail/SendGrid)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Copy `.env` file and update the following variables:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database
   MONGO_URI=mongodb://localhost:27017/mern-scalable-boilerplate

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-this-in-production
   JWT_EXPIRE=15m
   JWT_REFRESH_EXPIRE=7d

   # Email Configuration
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password

   # Frontend URL
   CLIENT_URL=http://localhost:3000

   # Password Reset Configuration
   RESET_TOKEN_EXPIRE=10
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
- **POST** `/auth/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "isEmailVerified": false
      },
      "token": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
  ```

#### Login User
- **POST** `/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "SecurePass123!"
  }
  ```

#### Refresh Token
- **POST** `/auth/refresh`
- **Body:**
  ```json
  {
    "refreshToken": "jwt_refresh_token"
  }
  ```

#### Logout User
- **POST** `/auth/logout`
- **Headers:** `Authorization: Bearer <access_token>`
- **Body:**
  ```json
  {
    "refreshToken": "jwt_refresh_token"
  }
  ```

#### Get User Profile
- **GET** `/auth/profile`
- **Headers:** `Authorization: Bearer <access_token>`

#### Update User Profile
- **PUT** `/auth/profile`
- **Headers:** `Authorization: Bearer <access_token>`
- **Body:**
  ```json
  {
    "name": "John Smith",
    "email": "johnsmith@example.com"
  }
  ```

#### Request Password Reset
- **POST** `/auth/reset-password`
- **Body:**
  ```json
  {
    "email": "john@example.com"
  }
  ```

#### Reset Password
- **POST** `/auth/reset-password/:resettoken`
- **Body:**
  ```json
  {
    "password": "NewSecurePass123!"
  }
  ```

### Health Check
- **GET** `/health`

## 🔐 Security Features

### Password Requirements
- Minimum 6 characters
- At least one lowercase letter
- At least one uppercase letter
- At least one number
- At least one special character

### Rate Limiting
- General API: 100 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes
- Password reset: 3 requests per hour

### JWT Configuration
- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Refresh tokens are stored in database for validation

## 🗂️ Project Structure

```
project-backend/
├── src/
│   ├── controllers/
│   │   └── authController.js     # Authentication logic
│   ├── middlewares/
│   │   ├── auth.js              # JWT authentication & authorization
│   │   └── validation.js        # Request validation
│   ├── models/
│   │   └── User.js              # User schema and methods
│   ├── routes/
│   │   └── auth.js              # Authentication routes
│   ├── services/
│   │   └── emailService.js      # Email sending functionality
│   ├── utils/
│   │   ├── validation.js        # Joi validation schemas
│   │   ├── response.js          # Response helper functions
│   │   └── crypto.js            # Cryptographic utilities
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   └── app.js                   # Express app configuration
├── .env                         # Environment variables
├── server.js                    # Server entry point
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🚦 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials/token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limiting)
- `500` - Internal Server Error

## 🧪 Testing

You can test the API endpoints using tools like:
- Postman
- Thunder Client (VS Code extension)
- curl commands

## 📝 Environment Setup

### Email Configuration (Gmail)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in `EMAIL_PASS`

### MongoDB Setup
- Local: Install MongoDB locally or use MongoDB Atlas
- Update `MONGO_URI` with your connection string

## 🔄 Integration with Frontend

This backend is designed to work with the frontend in the `project-ui` folder. The frontend expects:

1. **Authentication endpoints** at `/api/auth/*`
2. **JWT tokens** in the format: `Bearer <token>`
3. **Consistent response format** with `success`, `message`, and `data` fields
4. **CORS enabled** for the frontend URL

## 🚀 Deployment

### Environment Variables for Production
Ensure you set secure values for:
- `JWT_SECRET` - Use a strong, random string
- `JWT_REFRESH_SECRET` - Different from JWT_SECRET
- `MONGO_URI` - Production database connection
- `EMAIL_USER` and `EMAIL_PASS` - Production email credentials
- `NODE_ENV=production`

### Security Checklist
- [ ] Strong JWT secrets
- [ ] Secure database connection
- [ ] Email service configured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Environment variables secured

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.
