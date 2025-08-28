# Authentication System Documentation

This comprehensive authentication system provides production-ready authentication features using Zustand for state management and custom React hooks for easy integration.

## 🚀 Features

- **Complete Authentication Flow**: Login, Signup, Logout, Account Deletion
- **Token Management**: JWT token handling with automatic refresh
- **Role-Based Access Control**: Support for user roles and permissions
- **Persistent State**: Auth state persists across browser sessions
- **Security**: Secure token storage with cookies and localStorage
- **TypeScript**: Full TypeScript support with comprehensive types
- **Scalable Architecture**: Modular design for easy extension
- **Production Ready**: Error handling, retry logic, and security best practices

## 📁 Project Structure

```
src/
├── types/
│   ├── auth.ts           # Authentication types and interfaces
│   ├── api.ts            # API-related types
│   ├── common.ts         # Common utility types
│   └── index.ts          # Type exports
├── config/
│   └── auth.config.ts    # Authentication configuration
├── lib/
│   ├── token.utils.ts    # Token management utilities
│   └── utils.ts          # General utilities
├── services/
│   ├── auth.service.ts   # Authentication API service
│   └── index.tsx         # Service exports
├── stores/
│   ├── auth.store.ts     # Zustand auth store
│   └── index.ts          # Store exports
├── hooks/
│   ├── useAuth.ts        # Authentication hooks
│   └── index.ts          # Hook exports
└── components/
    ├── auth/
    │   ├── AuthProvider.tsx   # Auth context provider
    │   ├── AuthForms.tsx      # Login/Signup forms
    │   └── index.ts           # Component exports
    └── ExampleApp.tsx         # Complete usage example
```

## 🔧 Installation & Setup

1. Install required dependencies:
```bash
npm install zustand js-cookie
npm install -D @types/js-cookie
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your API base URL
VITE_API_BASE_URL=http://localhost:3000
```

## 📖 Usage

### Basic Authentication Hook

```tsx
import { useAuth } from './hooks/useAuth';

const MyComponent = () => {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    login, 
    logout, 
    hasRole 
  } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      {hasRole('admin') && <AdminPanel />}
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

### Protected Routes

```tsx
import { ProtectedRoute } from './components/auth';

<ProtectedRoute roles={['admin']} requireAll={false}>
  <AdminDashboard />
</ProtectedRoute>
```

### Login/Signup Forms

```tsx
import { LoginForm, SignupForm } from './components/auth';

<LoginForm 
  onSuccess={() => navigate('/dashboard')}
  onError={(error) => showToast(error)}
/>
```

## 🔐 API Integration

The system expects these API endpoints:

### Login: `POST /endpoint/login`
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Signup: `POST /endpoint/signup`
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "userType": "individual"
}
```

### Delete Account: `DELETE /endpoint/deleteAccount`
```json
{
  "password": "password123",
  "reason": "No longer needed"
}
```

## 📊 Available Hooks

### Core Hooks
- `useAuth()` - Complete authentication state and actions
- `useAuthStatus()` - Lightweight auth status checking
- `useAuthTokens()` - Token management
- `usePermissions()` - Role-based access control
- `useUserProfile()` - User profile management

### Action Hooks
- `useLogin()` - Login functionality
- `useSignup()` - User registration
- `useLogout()` - Logout functionality
- `useDeleteAccount()` - Account deletion

## 🛡️ Security Features

- **JWT Token Management**: Secure token storage and automatic refresh
- **Role-Based Access Control**: Granular permission system
- **Secure Cookies**: HTTPOnly and secure cookie options
- **Request Interceptors**: Automatic token attachment and refresh
- **Error Handling**: Comprehensive error handling and user feedback
- **Token Expiration**: Automatic token refresh before expiration

## 🔧 Configuration

Configure the system via `src/config/auth.config.ts`:

```typescript
export const AUTH_CONFIG: AuthConfig = {
  tokenStorageKey: "auth_token",
  refreshTokenStorageKey: "refresh_token",
  tokenExpirationBuffer: 5, // minutes
  autoRefreshEnabled: true,
  persistAuth: true,
};
```

## 📝 Type Definitions

The system includes comprehensive TypeScript types:

- `User` - User profile interface
- `AuthResponse` - API response types
- `LoginRequest`/`SignupRequest` - Request DTOs
- `UserRole` - User role constants
- `UserType` - User type constants
- `AuthStore` - Zustand store interface

## 🎯 Best Practices

1. **Use the appropriate hook for your needs**:
   - `useAuth()` for full functionality
   - `useAuthStatus()` for simple checks
   - `usePermissions()` for role-based logic

2. **Implement proper error handling**:
   ```tsx
   const { login, error } = useLogin();
   
   if (error) {
     // Show user-friendly error message
   }
   ```

3. **Use ProtectedRoute for sensitive components**:
   ```tsx
   <ProtectedRoute roles={['admin', 'moderator']}>
     <AdminPanel />
   </ProtectedRoute>
   ```

4. **Leverage the token manager utilities**:
   ```tsx
   import { TokenManager } from './lib/token.utils';
   
   const isValid = TokenManager.isCurrentTokenValid();
   ```

## 🚀 Production Deployment

1. Set production environment variables
2. Enable secure cookies in production
3. Configure CORS on your API server
4. Set up proper error monitoring
5. Implement rate limiting on auth endpoints

## 🤝 Contributing

The architecture is designed to be extensible. You can:

- Add new authentication methods
- Extend user roles and permissions
- Add custom middleware to the auth service
- Implement additional security features

This system provides a solid foundation for authentication in React applications with TypeScript, following modern best practices and security standards.
