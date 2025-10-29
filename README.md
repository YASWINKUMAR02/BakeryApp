# 🥐 Bakery Management System

A full-stack web application for managing a bakery business with separate interfaces for customers and administrators.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)

## ✨ Features

### Customer Features
- 🏠 **Beautiful Home Page** with carousel and featured items
- 🛍️ **Browse Products** by categories with search and filter
- 🛒 **Shopping Cart** with quantity management
- 📦 **Order Placement** with delivery details
- 📜 **Order History** with detailed tracking
- 👤 **User Authentication** and profile management

### Admin Features
- 📊 **Dashboard** with business overview
- 🗂️ **Category Management** (Create, Read, Update, Delete)
- 🍰 **Item Management** with pricing and weight
- 📋 **Order Management** with status updates
- 👥 **Customer Management** and insights
- 🔐 **Secure Admin Panel**

## 🛠️ Tech Stack

### Backend
- **Framework:** Spring Boot 3.x
- **Language:** Java 17+
- **Database:** MySQL
- **ORM:** Spring Data JPA / Hibernate
- **Security:** Spring Security (planned)
- **Validation:** Jakarta Bean Validation
- **Build Tool:** Maven

### Frontend
- **Framework:** React 18
- **UI Library:** Material-UI (MUI)
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **State Management:** React Context API
- **Styling:** Material-UI + Custom CSS

## 📁 Project Structure

```
BakeryApp/
├── bakeryapp/                 # Backend (Spring Boot)
│   ├── src/main/java/
│   │   └── com/bakery/app/
│   │       ├── controller/    # REST Controllers
│   │       ├── service/       # Business Logic
│   │       ├── repository/    # Data Access Layer
│   │       ├── entity/        # JPA Entities
│   │       ├── dto/           # Data Transfer Objects
│   │       └── exception/     # Custom Exceptions
│   └── pom.xml
│
└── bakery-frontend/           # Frontend (React)
    ├── src/
    │   ├── components/        # Reusable Components
    │   ├── pages/             # Page Components
    │   │   ├── customer/      # Customer Pages
    │   │   └── admin/         # Admin Pages
    │   ├── services/          # API Services
    │   ├── context/           # Context Providers
    │   └── App.js
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 16+ and npm
- MySQL 8.0+
- Maven 3.6+

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BakeryApp/bakeryapp
   ```

2. **Configure Database**
   
   Create a MySQL database:
   ```sql
   CREATE DATABASE bakery_db;
   ```

   Update `application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/bakery_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. **Run the application**
   ```bash
   mvnw spring-boot:run
   ```

   Backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd bakery-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

   Frontend will start on `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Endpoints

#### Customer APIs
- `POST /customers/register` - Register new customer
- `POST /customers/login` - Customer login
- `GET /customers` - Get all customers (Admin)
- `GET /customers/{id}` - Get customer by ID
- `PUT /customers/{id}` - Update customer

#### Item APIs
- `GET /items` - Get all items
- `GET /items/{id}` - Get item by ID
- `GET /items/category/{categoryId}` - Get items by category
- `POST /items` - Create new item (Admin)
- `PUT /items/{id}` - Update item (Admin)
- `DELETE /items/{id}` - Delete item (Admin)

#### Category APIs
- `GET /categories` - Get all categories
- `GET /categories/{id}` - Get category by ID
- `POST /categories` - Create category (Admin)
- `PUT /categories/{id}` - Update category (Admin)
- `DELETE /categories/{id}` - Delete category (Admin)

#### Cart APIs
- `GET /cart/{customerId}` - Get customer cart
- `POST /cart/add?customerId={id}` - Add item to cart
- `PUT /cart/update/{cartItemId}?quantity={qty}` - Update cart item
- `DELETE /cart/remove/{cartItemId}` - Remove item from cart

#### Order APIs
- `GET /orders` - Get all orders (Admin)
- `GET /orders/{customerId}` - Get customer orders
- `POST /orders/place/{customerId}` - Place new order
- `PUT /orders/status/{orderId}` - Update order status (Admin)

## 🎨 Key Features Implemented

### Currency & Measurements
- All prices displayed in **Indian Rupees (₹)**
- Item weights shown in **grams (g)**
- Proper formatting throughout the application

### Order Management
- Complete order lifecycle tracking
- Delivery details collection
- Order status management (Pending → Confirmed → Delivered)
- Historical order preservation

### Smart Deletion
- Items can only be deleted if not in active orders
- Automatic cleanup of cart items when deleting products
- Prevents data integrity issues

### User Experience
- Responsive design for all screen sizes
- Loading states and error handling
- Confirmation dialogs for destructive actions
- Success/error notifications
- Intuitive navigation

## 🔒 Security Features (Planned)
- JWT-based authentication
- Role-based access control (RBAC)
- Password encryption
- CORS configuration
- Input sanitization

## 📱 Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface
- Adaptive layouts

## 🧪 Testing (Planned)
- Unit tests for services
- Integration tests for APIs
- E2E tests for critical flows
- Component testing for React

## 🚀 Deployment (Planned)
- Docker containerization
- CI/CD pipeline
- Cloud deployment (AWS/Azure)
- Environment-based configuration

## 📈 Future Enhancements
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] SMS alerts for order updates
- [ ] Analytics dashboard
- [ ] Inventory management
- [ ] Customer reviews and ratings
- [ ] Discount and coupon system
- [ ] Multi-language support
- [ ] PWA capabilities
- [ ] Real-time order tracking

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License.

## 👨‍💻 Author
Developed with ❤️ for bakery businesses

## 📞 Support
For support, email support@bakeryapp.com or create an issue in the repository.

---

**Happy Baking! 🥐🍰🥖**
