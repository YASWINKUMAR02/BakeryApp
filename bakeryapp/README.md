# 🍰 Bakery Web Application

A comprehensive Spring Boot-based bakery management system with separate functionalities for customers and administrators.

## 📋 Features

### Customer Features
- ✅ Browse bakery items by category
- ✅ View item details and reviews
- ✅ Add items to shopping cart
- ✅ Manage cart (update quantities, remove items)
- ✅ Place orders
- ✅ View order history
- ✅ Leave reviews and ratings for items

### Admin Features
- ✅ Manage categories (Create, Read, Update, Delete)
- ✅ Manage items (Create, Read, Update, Delete)
- ✅ View all customers
- ✅ View and manage all orders
- ✅ Update order status (Pending → Confirmed → Delivered)

## 🏗️ Architecture

### Technology Stack
- **Backend**: Spring Boot 3.5.6
- **Database**: MySQL
- **ORM**: Spring Data JPA (Hibernate)
- **Security**: Spring Security with BCrypt password encoding
- **API Documentation**: Swagger/OpenAPI 3.0
- **Build Tool**: Maven
- **Java Version**: 17

### Project Structure
```
bakeryapp/
├── src/main/java/com/bakery/app/
│   ├── entity/          # JPA Entity classes
│   │   ├── Category.java
│   │   ├── Item.java
│   │   ├── Customer.java
│   │   ├── Cart.java
│   │   ├── CartItem.java
│   │   ├── Order.java
│   │   ├── OrderItem.java
│   │   ├── Admin.java
│   │   └── Review.java
│   │
│   ├── repository/      # Spring Data JPA Repositories
│   │   ├── CategoryRepository.java
│   │   ├── ItemRepository.java
│   │   ├── CustomerRepository.java
│   │   ├── CartRepository.java
│   │   ├── CartItemRepository.java
│   │   ├── OrderRepository.java
│   │   ├── OrderItemRepository.java
│   │   ├── AdminRepository.java
│   │   └── ReviewRepository.java
│   │
│   ├── service/         # Business Logic Layer
│   │   ├── CategoryService.java
│   │   ├── ItemService.java
│   │   ├── CustomerService.java
│   │   ├── CartService.java
│   │   ├── OrderService.java
│   │   ├── AdminService.java
│   │   └── ReviewService.java
│   │
│   ├── controller/      # REST API Controllers
│   │   ├── CategoryController.java
│   │   ├── ItemController.java
│   │   ├── CustomerController.java
│   │   ├── CartController.java
│   │   ├── OrderController.java
│   │   ├── AdminController.java
│   │   └── ReviewController.java
│   │
│   ├── dto/            # Data Transfer Objects
│   │   ├── LoginRequest.java
│   │   ├── CustomerRegistrationRequest.java
│   │   ├── CategoryRequest.java
│   │   ├── ItemRequest.java
│   │   ├── CartItemRequest.java
│   │   ├── ReviewRequest.java
│   │   ├── OrderStatusRequest.java
│   │   └── ApiResponse.java
│   │
│   ├── config/         # Configuration Classes
│   │   └── SecurityConfig.java
│   │
│   └── BakeryAppApplication.java
│
└── src/main/resources/
    └── application.properties
```

## 🗄️ Database Schema

### Entity Relationships
```
Category (1) ──────< (Many) Item
Item (1) ──────< (Many) Review
Customer (1) ──────< (Many) Review
Customer (1) ──────< (Many) Order
Customer (1) ────── (1) Cart
Cart (1) ──────< (Many) CartItem
CartItem (Many) ──────> (1) Item
Order (1) ──────< (Many) OrderItem
OrderItem (Many) ──────> (1) Item
```

### Tables
1. **categories** - Product categories (Cakes, Breads, Pastries, etc.)
2. **items** - Bakery products with name, description, price, image
3. **customers** - Customer accounts with hashed passwords
4. **admins** - Admin accounts with hashed passwords
5. **carts** - Shopping carts (one per customer)
6. **cart_items** - Items in each cart
7. **orders** - Customer orders with status tracking
8. **order_items** - Items in each order (snapshot at order time)
9. **reviews** - Customer reviews with ratings (1-5) and comments

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+
- IDE (IntelliJ IDEA, Eclipse, or VS Code)

### Installation Steps

1. **Clone the repository**
   ```bash
   cd c:\GaMes\BakeryApp\bakeryapp
   ```

2. **Set up MySQL Database**
   ```sql
   CREATE DATABASE bakery_db;
   ```
   Or let the application auto-create it (configured in application.properties)

3. **Configure Database Connection**
   
   Edit `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/bakery_db?createDatabaseIfNotExist=true
   spring.datasource.username=YOUR_USERNAME
   spring.datasource.password=YOUR_PASSWORD
   ```

4. **Build the Project**
   ```bash
   mvn clean install
   ```

5. **Run the Application**
   ```bash
   mvn spring-boot:run
   ```

6. **Access the API**
   
   The application will start on `http://localhost:8080`

7. **Access Swagger UI**
   
   Open your browser and navigate to:
   - **Swagger UI**: `http://localhost:8080/swagger-ui.html`
   - **API Docs (JSON)**: `http://localhost:8080/api-docs`

## 📡 API Endpoints

### 🔍 Interactive API Documentation
Access the **Swagger UI** at `http://localhost:8080/swagger-ui.html` to:
- View all available endpoints
- Test APIs directly from the browser
- See request/response schemas
- Download OpenAPI specification

### Categories
- `POST /api/categories` - Create category
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get category by ID
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Items
- `POST /api/items` - Create item
- `GET /api/items` - Get all items
- `GET /api/items/{id}` - Get item by ID
- `GET /api/items/category/{categoryId}` - Get items by category
- `PUT /api/items/{id}` - Update item
- `DELETE /api/items/{id}` - Delete item

### Customers
- `POST /api/customers/register` - Register new customer
- `POST /api/customers/login` - Customer login
- `GET /api/customers/{id}` - Get customer by ID
- `GET /api/customers` - Get all customers (Admin)
- `PUT /api/customers/{id}` - Update customer

### Cart
- `POST /api/cart/add?customerId={id}` - Add item to cart
- `GET /api/cart/{customerId}` - Get customer's cart
- `PUT /api/cart/update/{cartItemId}?quantity={qty}` - Update cart item
- `DELETE /api/cart/remove/{cartItemId}` - Remove cart item

### Orders
- `POST /api/orders/place/{customerId}` - Place order
- `GET /api/orders/{customerId}` - Get customer orders
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/detail/{orderId}` - Get order details
- `PUT /api/orders/status/{orderId}` - Update order status

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/dashboard` - Admin dashboard

### Reviews
- `POST /api/reviews/{itemId}?customerId={id}` - Create review
- `GET /api/reviews/item/{itemId}` - Get reviews for item
- `DELETE /api/reviews/{reviewId}` - Delete review

For detailed API documentation with request/response examples, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

## 🔒 Security

- Passwords are encrypted using BCrypt
- Spring Security is configured (currently permitting all requests for development)
- CORS is disabled for development (enable in production)
- CSRF protection is disabled (enable for production web apps)

### Production Security Recommendations
1. Enable CORS with specific origins
2. Enable CSRF protection
3. Implement JWT-based authentication
4. Add role-based access control (RBAC)
5. Use HTTPS in production

## 🧪 Testing the Application

### Using cURL

1. **Create a Category**
   ```bash
   curl -X POST http://localhost:8080/api/categories \
     -H "Content-Type: application/json" \
     -d '{"name": "Cakes"}'
   ```

2. **Create an Item**
   ```bash
   curl -X POST http://localhost:8080/api/items \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Chocolate Cake",
       "description": "Delicious chocolate cake",
       "price": 25.99,
       "imageUrl": "chocolate-cake.jpg",
       "categoryId": 1
     }'
   ```

3. **Register a Customer**
   ```bash
   curl -X POST http://localhost:8080/api/customers/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "John Doe",
       "email": "john@example.com",
       "phone": "1234567890",
       "password": "password123"
     }'
   ```

### Using Swagger UI (Recommended)
1. Start the application
2. Open `http://localhost:8080/swagger-ui.html` in your browser
3. Explore all endpoints organized by controller
4. Click "Try it out" on any endpoint
5. Fill in the required parameters
6. Click "Execute" to test the API

### Using Postman
Import the API endpoints into Postman and test each endpoint with the request bodies shown in the API documentation.

## 📦 Dependencies

```xml
<!-- Spring Boot Starters -->
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- spring-boot-starter-security
- spring-boot-starter-validation

<!-- Database -->
- mysql-connector-j

<!-- API Documentation -->
- springdoc-openapi-starter-webmvc-ui (v2.3.0)

<!-- Utilities -->
- lombok
- spring-boot-devtools
```

## 🛠️ Development

### Adding New Features
1. Create entity in `entity/` package
2. Create repository in `repository/` package
3. Create service in `service/` package
4. Create controller in `controller/` package
5. Add DTOs if needed in `dto/` package

### Code Style
- Uses Lombok annotations (@Data, @RequiredArgsConstructor, etc.)
- Follows Spring Boot best practices
- RESTful API design principles
- Proper exception handling with try-catch blocks

## 📝 Future Enhancements

- [ ] JWT-based authentication
- [ ] Role-based access control
- [ ] Payment gateway integration
- [ ] Email notifications for orders
- [ ] Image upload functionality
- [ ] Search and filter functionality
- [ ] Pagination for large datasets
- [ ] Frontend (React/Angular)
- [ ] Unit and integration tests
- [ ] API rate limiting
- [ ] Caching with Redis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Author

Bakery App Development Team

## 📞 Support

For issues and questions, please create an issue in the repository.

---

**Happy Baking! 🍰🥖🧁**
