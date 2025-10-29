# 🔒 Validation Guide - Bakery Application

## Overview

The application now includes comprehensive validation for email, password, and other fields to ensure data integrity and security.

## Validation Rules

### Customer & Admin Fields

#### **Email Validation**
- **Required**: Cannot be blank or null
- **Format**: Must be a valid email format (e.g., user@example.com)
- **Constraint**: `@Email` annotation
- **Error Messages**:
  - "Email is required" - when blank
  - "Email should be valid" - when format is invalid

#### **Password Validation**
- **Required**: Cannot be blank or null
- **Minimum Length**: 6 characters
- **Maximum Length**: 100 characters
- **Constraint**: `@Size(min = 6, max = 100)`
- **Error Messages**:
  - "Password is required" - when blank
  - "Password must be at least 6 characters" - when too short

#### **Name Validation**
- **Required**: Cannot be blank or null
- **Minimum Length**: 2 characters
- **Maximum Length**: 100 characters
- **Error Messages**:
  - "Name is required" - when blank
  - "Name must be between 2 and 100 characters" - when invalid length

#### **Phone Validation** (Customer only)
- **Required**: Cannot be blank or null
- **Format**: Must be 10-15 digits (numbers only)
- **Pattern**: `^[0-9]{10,15}$`
- **Error Messages**:
  - "Phone is required" - when blank
  - "Phone number must be 10-15 digits" - when format is invalid

## Validated Entities

### 1. Customer Entity
```java
@Entity
public class Customer {
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100)
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^[0-9]{10,15}$")
    private String phone;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100)
    private String password;
}
```

### 2. Admin Entity
```java
@Entity
public class Admin {
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100)
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100)
    private String password;
}
```

## Validated DTOs

### 1. CustomerRegistrationRequest
```java
public class CustomerRegistrationRequest {
    @NotBlank
    @Size(min = 2, max = 100)
    private String name;
    
    @NotBlank
    @Email
    private String email;
    
    @NotBlank
    @Pattern(regexp = "^[0-9]{10,15}$")
    private String phone;
    
    @NotBlank
    @Size(min = 6, max = 100)
    private String password;
}
```

### 2. LoginRequest
```java
public class LoginRequest {
    @NotBlank
    @Email
    private String email;
    
    @NotBlank
    private String password;
}
```

## API Validation Behavior

### Valid Request Example
```json
POST /api/customers/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "Customer registered successfully",
  "data": { ... }
}
```

### Invalid Request Example
```json
POST /api/customers/register
{
  "name": "J",
  "email": "invalid-email",
  "phone": "123",
  "password": "123"
}
```

**Response (400 Bad Request)**:
```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "name": "Name must be between 2 and 100 characters",
    "email": "Email should be valid",
    "phone": "Phone number must be 10-15 digits",
    "password": "Password must be at least 6 characters"
  }
}
```

## Testing Validation

### Using Swagger UI

1. Navigate to `http://localhost:8080/swagger-ui.html`
2. Expand `customer-controller`
3. Click on `POST /api/customers/register`
4. Click "Try it out"

#### Test Case 1: Invalid Email
```json
{
  "name": "John Doe",
  "email": "notanemail",
  "phone": "1234567890",
  "password": "password123"
}
```
**Expected**: 400 Bad Request with "Email should be valid"

#### Test Case 2: Short Password
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "123"
}
```
**Expected**: 400 Bad Request with "Password must be at least 6 characters"

#### Test Case 3: Invalid Phone
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "abc123",
  "password": "password123"
}
```
**Expected**: 400 Bad Request with "Phone number must be 10-15 digits"

#### Test Case 4: Missing Fields
```json
{
  "name": "",
  "email": "",
  "phone": "",
  "password": ""
}
```
**Expected**: 400 Bad Request with multiple "is required" errors

### Using cURL

```bash
# Invalid email test
curl -X POST http://localhost:8080/api/customers/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "invalid",
    "phone": "1234567890",
    "password": "password123"
  }'

# Short password test
curl -X POST http://localhost:8080/api/customers/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "password": "123"
  }'
```

## Validation Annotations Reference

### Common Annotations Used

| Annotation | Purpose | Example |
|------------|---------|---------|
| `@NotBlank` | Field cannot be null or empty | `@NotBlank(message = "Name is required")` |
| `@Email` | Must be valid email format | `@Email(message = "Email should be valid")` |
| `@Size` | String length constraints | `@Size(min = 6, max = 100)` |
| `@Pattern` | Regex pattern matching | `@Pattern(regexp = "^[0-9]{10,15}$")` |
| `@Valid` | Triggers validation on object | `@Valid @RequestBody Request req` |

## Global Exception Handler

The application includes a `GlobalExceptionHandler` that:
- Catches validation errors (`MethodArgumentNotValidException`)
- Formats error messages in a user-friendly way
- Returns structured error responses
- Handles all exceptions globally

**Location**: `com.bakery.app.exception.GlobalExceptionHandler`

## Password Security

### Current Implementation
- Passwords are validated for minimum length (6 characters)
- Passwords are hashed using BCrypt before storage
- Plain text passwords are never stored in the database

### Recommendations for Production
1. **Increase minimum length** to 8-12 characters
2. **Add complexity requirements**:
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - At least one special character
3. **Example pattern**:
   ```java
   @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
            message = "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character")
   ```

## Email Validation

### Current Implementation
- Uses standard `@Email` annotation
- Validates basic email format (user@domain.com)

### Enhanced Validation (Optional)
For stricter email validation:
```java
@Pattern(regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
         message = "Please provide a valid email address")
```

## Affected Endpoints

### Customer Endpoints
- ✅ `POST /api/customers/register` - Full validation
- ✅ `POST /api/customers/login` - Email and password validation
- ✅ `PUT /api/customers/{id}` - Full validation

### Admin Endpoints
- ✅ `POST /api/admin/login` - Email and password validation

## Best Practices

1. **Always use `@Valid`** in controller methods to trigger validation
2. **Provide clear error messages** for better user experience
3. **Validate at multiple layers**: DTO, Entity, and Service
4. **Use consistent validation rules** across the application
5. **Test validation** thoroughly before deployment

## Troubleshooting

### Validation Not Working
1. Ensure `@Valid` annotation is present in controller methods
2. Check that validation dependency is in `pom.xml`:
   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-validation</artifactId>
   </dependency>
   ```
3. Verify `GlobalExceptionHandler` is in the component scan path

### Custom Error Messages Not Showing
1. Check the `message` attribute in validation annotations
2. Ensure `GlobalExceptionHandler` is properly configured
3. Verify the exception is being caught correctly

---

**Validation ensures data quality and security! 🔒**
