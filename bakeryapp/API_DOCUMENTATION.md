# Bakery App - API Documentation

## Overview
This is a comprehensive bakery web application with two roles:
- **Admin (Owner)**: Manage items, categories, customers, and orders
- **Customer**: Browse items, add to cart, and place orders

## Base URL
```
http://localhost:8080/api
```

---

## 1. Category APIs

### Create Category (Admin)
```http
POST /categories
Content-Type: application/json

{
  "name": "Cakes"
}
```

### Get All Categories
```http
GET /categories
```

### Get Category by ID
```http
GET /categories/{id}
```

### Update Category (Admin)
```http
PUT /categories/{id}
Content-Type: application/json

{
  "name": "Updated Category Name"
}
```

### Delete Category (Admin)
```http
DELETE /categories/{id}
```

---

## 2. Item APIs

### Create Item (Admin)
```http
POST /items
Content-Type: application/json

{
  "name": "Chocolate Cake",
  "description": "Delicious chocolate cake",
  "price": 25.99,
  "imageUrl": "https://example.com/cake.jpg",
  "categoryId": 1
}
```

### Get All Items
```http
GET /items
```

### Get Item by ID
```http
GET /items/{id}
```

### Get Items by Category
```http
GET /items/category/{categoryId}
```

### Update Item (Admin)
```http
PUT /items/{id}
Content-Type: application/json

{
  "name": "Updated Chocolate Cake",
  "description": "Updated description",
  "price": 29.99,
  "imageUrl": "https://example.com/updated-cake.jpg",
  "categoryId": 1
}
```

### Delete Item (Admin)
```http
DELETE /items/{id}
```

---

## 3. Customer APIs

### Register Customer
```http
POST /customers/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123"
}
```

### Login Customer
```http
POST /customers/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Customer by ID
```http
GET /customers/{id}
```

### Get All Customers (Admin)
```http
GET /customers
```

### Update Customer
```http
PUT /customers/{id}
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "9876543210",
  "password": "newpassword123"
}
```

---

## 4. Cart APIs

### Add Item to Cart
```http
POST /cart/add?customerId=1
Content-Type: application/json

{
  "itemId": 1,
  "quantity": 2
}
```

### Get Customer Cart
```http
GET /cart/{customerId}
```

### Update Cart Item Quantity
```http
PUT /cart/update/{cartItemId}?quantity=3
```

### Remove Item from Cart
```http
DELETE /cart/remove/{cartItemId}
```

---

## 5. Order APIs

### Place Order
```http
POST /orders/place/{customerId}
```

### Get Customer Orders
```http
GET /orders/{customerId}
```

### Get All Orders (Admin)
```http
GET /orders
```

### Get Order by ID
```http
GET /orders/detail/{orderId}
```

### Update Order Status (Admin)
```http
PUT /orders/status/{orderId}
Content-Type: application/json

{
  "status": "Confirmed"
}
```
**Status Options**: Pending, Confirmed, Delivered

---

## 6. Admin APIs

### Admin Login
```http
POST /admin/login
Content-Type: application/json

{
  "email": "admin@bakery.com",
  "password": "admin123"
}
```

### Admin Dashboard
```http
GET /admin/dashboard
```

---

## 7. Review APIs

### Create Review
```http
POST /reviews/{itemId}?customerId=1
Content-Type: application/json

{
  "rating": 5,
  "comment": "Excellent cake!"
}
```

### Get Reviews for Item
```http
GET /reviews/item/{itemId}
```

### Delete Review
```http
DELETE /reviews/{reviewId}
```

---

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "data": null
}
```

---

## Database Schema

### Tables Created:
1. **categories** - Product categories
2. **items** - Bakery items/products
3. **customers** - Customer accounts
4. **admins** - Admin accounts
5. **carts** - Shopping carts
6. **cart_items** - Items in cart
7. **orders** - Customer orders
8. **order_items** - Items in each order
9. **reviews** - Customer reviews for items

---

## Setup Instructions

1. **Install MySQL** and create a database named `bakery_db` (or it will be auto-created)

2. **Update Database Credentials** in `application.properties`:
   ```properties
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. **Run the Application**:
   ```bash
   mvn spring-boot:run
   ```

4. **Access the API** at `http://localhost:8080/api`

---

## Testing the Application

### Step 1: Create Categories
```bash
curl -X POST http://localhost:8080/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Cakes"}'
```

### Step 2: Create Items
```bash
curl -X POST http://localhost:8080/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Chocolate Cake",
    "description": "Rich chocolate cake",
    "price": 25.99,
    "imageUrl": "cake.jpg",
    "categoryId": 1
  }'
```

### Step 3: Register Customer
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

### Step 4: Add to Cart
```bash
curl -X POST "http://localhost:8080/api/cart/add?customerId=1" \
  -H "Content-Type: application/json" \
  -d '{
    "itemId": 1,
    "quantity": 2
  }'
```

### Step 5: Place Order
```bash
curl -X POST http://localhost:8080/api/orders/place/1
```
