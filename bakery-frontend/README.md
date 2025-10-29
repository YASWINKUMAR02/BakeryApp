# Bakery App - React Frontend

Professional React frontend for the Bakery Application with Material-UI.

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
cd bakery-frontend
npm install
```

2. **Start the development server:**
```bash
npm start
```

The app will open at `http://localhost:3000`

## 📋 Features

### Current Features
- ✅ User Registration
- ✅ User Login
- ✅ Protected Routes
- ✅ Authentication Context
- ✅ Professional UI with Material-UI
- ✅ Form Validation
- ✅ Error Handling

### Coming Soon
- 🔄 Browse Items
- 🔄 Shopping Cart
- 🔄 Place Orders
- 🔄 Order History
- 🔄 Product Reviews
- 🔄 Admin Dashboard

## 🎨 Tech Stack

- **React** 18.2.0
- **Material-UI** 5.15.0
- **React Router** 6.20.0
- **Axios** 1.6.2
- **Emotion** (CSS-in-JS)

## 📁 Project Structure

```
bakery-frontend/
├── public/
│   └── index.html
├── src/
│   ├── context/
│   │   └── AuthContext.js       # Authentication state management
│   ├── pages/
│   │   ├── Login.js             # Login page
│   │   ├── Register.js          # Registration page
│   │   └── Dashboard.js         # User dashboard
│   ├── services/
│   │   └── api.js               # API service layer
│   ├── App.js                   # Main app component
│   └── index.js                 # Entry point
└── package.json
```

## 🔌 API Integration

The frontend connects to the Spring Boot backend at `http://localhost:8080/api`

### Available Endpoints
- `POST /customers/register` - Register new customer
- `POST /customers/login` - Customer login
- `POST /admin/register` - Register admin
- `POST /admin/login` - Admin login

## 🎯 Usage

### Register a New Account
1. Go to `http://localhost:3000/register`
2. Fill in the form:
   - Full Name
   - Email
   - Phone (10-15 digits)
   - Password (min 6 characters)
   - Confirm Password
3. Click "Sign Up"

### Login
1. Go to `http://localhost:3000/login`
2. Enter your email and password
3. Click "Sign In"

## 🎨 Design Features

- **Gradient Background** - Beautiful orange-themed gradient
- **Inline CSS** - All styling using inline styles
- **Material-UI Components** - Professional, accessible components
- **Responsive Design** - Works on all screen sizes
- **Form Validation** - Client-side validation with error messages
- **Loading States** - Visual feedback during API calls
- **Password Toggle** - Show/hide password functionality

## ⚙️ Configuration

### Backend URL
Update the API base URL in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

## 🐛 Troubleshooting

### CORS Issues
Make sure your Spring Boot backend has CORS enabled:
```java
@CrossOrigin(origins = "*")
```

### Port Already in Use
Change the port in `package.json`:
```json
"start": "PORT=3001 react-scripts start"
```

## 📝 Notes

- All styling is done with inline CSS as requested
- Material-UI provides the component structure
- Authentication state is managed with React Context
- Protected routes redirect to login if not authenticated

---

**Ready to start!** Run `npm start` and visit `http://localhost:3000` 🚀
