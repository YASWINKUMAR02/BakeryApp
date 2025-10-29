# JWT Authentication Implementation

## Overview
This document describes the JWT (JSON Web Token) authentication implementation for the Bakery Application.

## Backend Implementation

### 1. Dependencies Added (pom.xml)
```xml
<!-- JWT Dependencies -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
```

### 2. JWT Configuration (application.properties)
```properties
jwt.secret=mySecretKeyForBakeryAppThatIsAtLeast256BitsLongForHS256Algorithm
jwt.expiration=86400000  # 24 hours in milliseconds
```

### 3. Core Components Created

#### JwtUtil.java
- **Location**: `com.bakery.app.util.JwtUtil`
- **Purpose**: Utility class for JWT token generation and validation
- **Key Methods**:
  - `generateToken(email, role, userId)`: Creates a new JWT token
  - `validateToken(token)`: Validates token expiration
  - `extractEmail(token)`: Extracts email from token
  - `extractRole(token)`: Extracts user role from token
  - `extractUserId(token)`: Extracts user ID from token

#### JwtAuthenticationFilter.java
- **Location**: `com.bakery.app.config.JwtAuthenticationFilter`
- **Purpose**: Intercepts HTTP requests to validate JWT tokens
- **Functionality**:
  - Extracts JWT from Authorization header
  - Validates token and sets Spring Security context
  - Stores userId and userRole in request attributes

#### AuthResponse.java
- **Location**: `com.bakery.app.dto.AuthResponse`
- **Purpose**: DTO for authentication responses
- **Fields**:
  - `token`: JWT token
  - `type`: Token type (Bearer)
  - `id`: User ID
  - `name`: User name
  - `email`: User email
  - `phone`: User phone
  - `role`: User role (CUSTOMER/ADMIN)

### 4. Security Configuration

#### SecurityConfig.java Updates
- **Session Management**: Stateless (no server-side sessions)
- **CORS Configuration**: Allows requests from frontend (localhost:3000, localhost:3001)
- **JWT Filter**: Added before UsernamePasswordAuthenticationFilter

#### Endpoint Security Rules

**Public Endpoints** (No Authentication Required):
- `/api/customers/register`
- `/api/customers/login`
- `/api/admin/register`
- `/api/admin/login`
- `/api/items/**` (browsing items)
- `/api/categories/**` (browsing categories)
- `/api/reviews/item/**` (viewing reviews)
- Swagger/OpenAPI endpoints

**Admin Only Endpoints** (ROLE_ADMIN):
- `/api/admin/**`
- `/api/coupons/**`

**Customer Endpoints** (ROLE_CUSTOMER):
- `/api/cart/**`
- `/api/wishlist/**`
- `/api/reviews/**` (creating/deleting reviews)

**Customer or Admin Endpoints**:
- `/api/orders/**`
- `/api/order-history/**`

### 5. Controller Updates

#### CustomerController
- **Register**: Returns JWT token with user data
- **Login**: Returns JWT token with user data

#### AdminController
- **Register**: Returns JWT token with admin data
- **Login**: Returns JWT token with admin data

## Frontend Implementation

### 1. API Service Updates (api.js)

#### Request Interceptor
```javascript
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);
```

#### Response Interceptor
```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token expired or unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 2. AuthContext Updates

#### Login Function
- Stores user data in localStorage
- Stores JWT token separately in localStorage
- Token is automatically included in all API requests

#### Logout Function
- Removes user data from localStorage
- Removes JWT token from localStorage
- Redirects to login page

## Token Flow

### Registration/Login Flow
1. User submits credentials
2. Backend validates credentials
3. Backend generates JWT token with user info (email, role, userId)
4. Backend returns AuthResponse with token and user data
5. Frontend stores token in localStorage
6. Frontend stores user data in localStorage

### API Request Flow
1. Frontend makes API request
2. Request interceptor adds JWT token to Authorization header
3. Backend JwtAuthenticationFilter extracts and validates token
4. If valid, sets Spring Security context with user details
5. Backend processes request with authenticated user
6. Response returned to frontend

### Token Expiration Flow
1. Frontend makes API request with expired token
2. Backend returns 401 Unauthorized
3. Response interceptor catches 401 error
4. Frontend clears localStorage and redirects to login

## Security Features

### Backend Security
- **Stateless Authentication**: No server-side session storage
- **Role-Based Access Control**: Endpoints protected by user roles
- **Token Validation**: All protected endpoints validate JWT
- **Password Encryption**: BCrypt password encoding
- **CORS Protection**: Configured allowed origins

### Frontend Security
- **Token Storage**: Stored in localStorage (consider httpOnly cookies for production)
- **Automatic Token Inclusion**: Interceptor adds token to all requests
- **Token Expiration Handling**: Automatic logout on 401/403
- **Protected Routes**: React routes check authentication status

## Token Structure

### JWT Claims
```json
{
  "sub": "user@example.com",
  "role": "CUSTOMER",
  "userId": 123,
  "iat": 1234567890,
  "exp": 1234654290
}
```

## Testing JWT Authentication

### Using Postman/Insomnia

1. **Register/Login**:
   ```
   POST http://localhost:8080/api/customers/login
   Body: { "email": "user@example.com", "password": "password" }
   ```

2. **Copy Token** from response:
   ```json
   {
     "success": true,
     "message": "Login successful",
     "data": {
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
       "type": "Bearer",
       "id": 1,
       "name": "John Doe",
       "email": "user@example.com",
       "phone": "1234567890",
       "role": "CUSTOMER"
     }
   }
   ```

3. **Use Token** in subsequent requests:
   ```
   GET http://localhost:8080/api/cart/1
   Headers: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Production Considerations

### Security Enhancements
1. **Change JWT Secret**: Use a strong, randomly generated secret key
2. **Use Environment Variables**: Store secret in environment variables
3. **HTTPS Only**: Deploy with HTTPS in production
4. **HttpOnly Cookies**: Consider using httpOnly cookies instead of localStorage
5. **Refresh Tokens**: Implement refresh token mechanism for better security
6. **Token Blacklist**: Implement token revocation/blacklist for logout

### Configuration Updates for Production
```properties
# Use environment variables
jwt.secret=${JWT_SECRET:defaultSecretForDevelopmentOnly}
jwt.expiration=${JWT_EXPIRATION:86400000}
```

## Troubleshooting

### Common Issues

1. **401 Unauthorized on Protected Endpoints**
   - Verify token is being sent in Authorization header
   - Check token hasn't expired
   - Verify user has correct role for endpoint

2. **CORS Errors**
   - Check frontend URL is in allowed origins list
   - Verify CORS configuration in SecurityConfig

3. **Token Validation Errors**
   - Ensure JWT secret matches between token generation and validation
   - Check token format (should be "Bearer <token>")

## API Response Format

All authentication endpoints return:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "JWT_TOKEN_HERE",
    "type": "Bearer",
    "id": 1,
    "name": "User Name",
    "email": "user@example.com",
    "phone": "1234567890",
    "role": "CUSTOMER"
  }
}
```

## Next Steps

1. Run `mvn clean install` to download JWT dependencies
2. Start the backend server
3. Test authentication endpoints
4. Verify protected endpoints require valid JWT
5. Test frontend login/logout flow
