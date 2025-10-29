# 📚 Swagger UI Guide - Bakery Application

## What is Swagger UI?

Swagger UI is an interactive API documentation tool that allows you to:
- **Visualize** all API endpoints
- **Test** APIs directly from your browser
- **View** request/response schemas
- **Download** OpenAPI specification

## Accessing Swagger UI

Once your application is running, access Swagger UI at:

```
http://localhost:8080/swagger-ui.html
```

## Available Endpoints

### Swagger UI Endpoints
- **Swagger UI Interface**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON**: `http://localhost:8080/api-docs`
- **OpenAPI YAML**: `http://localhost:8080/api-docs.yaml`

## How to Use Swagger UI

### 1. Starting the Application
```bash
mvn spring-boot:run
```

### 2. Open Swagger UI
Navigate to `http://localhost:8080/swagger-ui.html` in your browser.

### 3. Explore API Endpoints
You'll see all endpoints organized by controllers:
- **admin-controller** - Admin operations
- **cart-controller** - Shopping cart operations
- **category-controller** - Category management
- **customer-controller** - Customer operations
- **item-controller** - Item/product management
- **order-controller** - Order management
- **review-controller** - Review operations

### 4. Testing an API Endpoint

#### Example: Creating a Category

1. **Expand** the `category-controller` section
2. **Click** on `POST /api/categories`
3. **Click** the "Try it out" button
4. **Enter** the request body:
   ```json
   {
     "name": "Cakes"
   }
   ```
5. **Click** "Execute"
6. **View** the response below

#### Example: Getting All Items

1. **Expand** the `item-controller` section
2. **Click** on `GET /api/items`
3. **Click** "Try it out"
4. **Click** "Execute"
5. **View** the list of items in the response

#### Example: Adding Item to Cart

1. **Expand** the `cart-controller` section
2. **Click** on `POST /api/cart/add`
3. **Click** "Try it out"
4. **Enter** the customerId parameter (e.g., `1`)
5. **Enter** the request body:
   ```json
   {
     "itemId": 1,
     "quantity": 2
   }
   ```
6. **Click** "Execute"

## Common Workflows in Swagger UI

### Workflow 1: Complete Customer Journey

1. **Register a Customer**
   - `POST /api/customers/register`
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "phone": "1234567890",
     "password": "password123"
   }
   ```

2. **Login**
   - `POST /api/customers/login`
   ```json
   {
     "email": "john@example.com",
     "password": "password123"
   }
   ```

3. **Browse Items**
   - `GET /api/items`

4. **Add to Cart**
   - `POST /api/cart/add?customerId=1`
   ```json
   {
     "itemId": 1,
     "quantity": 2
   }
   ```

5. **View Cart**
   - `GET /api/cart/1`

6. **Place Order**
   - `POST /api/orders/place/1`

7. **View Orders**
   - `GET /api/orders/1`

### Workflow 2: Admin Setup

1. **Create Categories**
   - `POST /api/categories`
   ```json
   {
     "name": "Cakes"
   }
   ```

2. **Create Items**
   - `POST /api/items`
   ```json
   {
     "name": "Chocolate Cake",
     "description": "Rich chocolate cake",
     "price": 25.99,
     "imageUrl": "chocolate-cake.jpg",
     "categoryId": 1
   }
   ```

3. **View All Orders**
   - `GET /api/orders`

4. **Update Order Status**
   - `PUT /api/orders/status/1`
   ```json
   {
     "status": "Confirmed"
   }
   ```

## Understanding Response Codes

### Success Responses
- **200 OK** - Request successful
- **201 Created** - Resource created successfully

### Error Responses
- **400 Bad Request** - Invalid request data
- **401 Unauthorized** - Authentication failed
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

## Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

## Schemas

Click on the **Schemas** section at the bottom of Swagger UI to view:
- **Entity models** (Category, Item, Customer, etc.)
- **Request DTOs** (LoginRequest, ItemRequest, etc.)
- **Response structure** (ApiResponse)

## Tips for Using Swagger UI

### 1. Model Expansion
Click on the model name in the request body section to see the full schema with field descriptions.

### 2. Copy cURL Commands
After executing a request, you can copy the cURL command for use in terminal or scripts.

### 3. Download OpenAPI Spec
Click on the `/api-docs` link to download the OpenAPI specification in JSON format.

### 4. Filter Endpoints
Use the search box at the top to filter endpoints by name or tag.

### 5. Persistent Data
Remember that data is stored in MySQL, so:
- Created items persist across restarts
- Use valid IDs when testing relationships
- Check the database if responses seem unexpected

## Configuration

Swagger is configured in:
- **Dependency**: `pom.xml` (springdoc-openapi-starter-webmvc-ui)
- **Configuration**: `OpenApiConfig.java`
- **Properties**: `application.properties`

### Current Configuration
```properties
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.operationsSorter=method
springdoc.swagger-ui.tagsSorter=alpha
```

## Troubleshooting

### Swagger UI Not Loading
1. Ensure the application is running: `mvn spring-boot:run`
2. Check the port: Default is `8080`
3. Clear browser cache
4. Try: `http://localhost:8080/swagger-ui/index.html`

### Endpoints Not Showing
1. Verify controllers have `@RestController` annotation
2. Check `@RequestMapping` paths
3. Restart the application

### 401 Unauthorized Errors
- Security is currently disabled for development
- All endpoints should be accessible without authentication

## Next Steps

After testing with Swagger UI:
1. Build a frontend application
2. Implement proper authentication (JWT)
3. Add role-based access control
4. Deploy to production

---

**Happy Testing! 🚀**

For more information, visit: [SpringDoc OpenAPI Documentation](https://springdoc.org/)
