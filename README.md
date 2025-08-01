# 🎯 Moringa Lost & Found Platform

A comprehensive digital platform for reporting, tracking, and recovering lost and found items within the Moringa community. Built with modern web technologies to provide a seamless experience for users to report lost items, claim found items, and offer rewards.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🌟 Overview

Moringa Lost & Found is a full-stack web application designed to help the Moringa community manage lost and found items efficiently. The platform includes:

- **Lost Item Reporting**: Users can report lost items with detailed descriptions and photos
- **Found Item Registration**: Finders can register found items for easy matching
- **Reward System**: Users can offer rewards for lost items with M-Pesa integration
- **User Authentication**: Secure login and registration system
- **Admin Dashboard**: Comprehensive management interface for item approval
- **Comments System**: Users can communicate about specific items

## ✨ Features

### 🔍 Lost & Found Management
- Report lost items with photos and detailed descriptions
- Register found items with location and finder details
- Search and filter items by category, location, and date
- Admin approval system for all reported items

### 💰 Reward System
- Create reward offers for lost items
- M-Pesa payment integration for reward processing
- Reward tracking and verification system
- Automated reward distribution upon successful claims

### 👤 User Management
- Secure user registration and authentication with JWT
- Profile management with user verification
- User roles and permissions (Admin, User)
- Activity tracking and item history

### 📊 Admin Features
- Dashboard with pending item approvals
- User management and oversight
- Item status management
- System analytics and reporting

### 💬 Communication
- Comment system for item discussions
- User-to-user communication about items
- Notification system for item updates

## 🛠 Tech Stack

### Backend
- **Framework**: Flask 3.0.0
- **Database**: PostgreSQL (Production) / SQLite (Development)
- **Authentication**: JWT (Flask-JWT-Extended 4.6.0)
- **ORM**: SQLAlchemy (Flask-SQLAlchemy 3.1.1)
- **Migrations**: Flask-Migrate 4.0.5
- **CORS**: Flask-CORS 4.0.0
- **Server**: Gunicorn 21.2.0
- **Environment**: python-dotenv 1.0.0

### Frontend
- **Framework**: React 19.1.0
- **State Management**: Redux Toolkit 2.8.2
- **Routing**: React Router DOM 7.7.0
- **HTTP Client**: Axios 1.11.0
- **Build Tool**: Vite 7.0.6
- **Testing**: Jest 30.0.5 + React Testing Library 16.3.0
- **Linting**: ESLint 9.30.1

### Infrastructure
- **Deployment**: Render (Backend) / Static Hosting (Frontend)
- **Database**: PostgreSQL on Render
- **Version Control**: Git
- **Environment Management**: Docker-ready

## 📁 Project Structure

```
moringa-lost-found/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── extensions.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── item.py
│   │   │   ├── report.py
│   │   │   └── reward.py
│   │   ├── controllers/
│   │   │   ├── auth_controller.py
│   │   │   ├── user_controller.py
│   │   │   ├── item_controller.py
│   │   │   ├── reward_controller.py
│   │   │   └── report_controller.py
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── auth_routes.py
│   │       ├── user_routes.py
│   │       ├── item_routes.py
│   │       ├── reward_routes.py
│   │       ├── report_routes.py
│   │       └── admin_routes.py
│   ├── migrations/
│   ├── tests/
│   ├── instance/
│   ├── requirements.txt
│   ├── config.py
│   ├── run.py
│   └── build.sh
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ItemsGrid.jsx
│   │   │   ├── ReportModal.jsx
│   │   │   ├── Comments.jsx
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── rewardService.js
│   │   │   └── commentService.js
│   │   ├── store/
│   │   │   ├── store.js
│   │   │   └── slices/
│   │   ├── context/
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── render.yaml
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL (for production)
- Git

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd moringa-lost-found/backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables**
```bash
# Create .env file with:
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///instance/app.db
JWT_SECRET_KEY=your-jwt-secret-key
```

5. **Initialize database**
```bash
flask db upgrade
```

6. **Run the development server**
```bash
python run.py
```
The API will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Create .env file with:
VITE_API_URL=http://localhost:5000
```

4. **Start development server**
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

## 🔐 Environment Variables

### Backend (.env)
```bash
# Flask Configuration
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-here

# Database
DATABASE_URL=sqlite:///instance/app.db  # Development
# DATABASE_URL=postgresql://user:password@localhost/moringa_lost_found  # Production

# JWT
JWT_SECRET_KEY=your-jwt-secret-key

# Optional: Email Configuration
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:5000
```

## 📖 API Documentation

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Item Endpoints
- `GET /items/` - Get all approved items
- `GET /items/<item_id>` - Get specific item details
- `POST /items/` - Add new found item (Admin only)
- `PUT /items/<item_id>` - Update item details (Admin only)
- `DELETE /items/<item_id>` - Delete item (Admin only)

### Report Endpoints
- `POST /reports/` - Submit lost item report
- `GET /reports/` - Get all reports (Admin only)
- `PUT /reports/<report_id>/approve` - Approve report (Admin only)

### Reward Endpoints
- `GET /rewards/` - Get all rewards
- `POST /rewards/` - Create new reward
- `GET /rewards/<reward_id>` - Get specific reward
- `PUT /rewards/<reward_id>` - Update reward
- `DELETE /rewards/<reward_id>` - Delete reward

### Comment Endpoints
- `GET /items/<item_id>/comments` - Get item comments
- `POST /items/<item_id>/comments` - Add comment to item

### Admin Endpoints
- `GET /admin/items/pending` - Get pending items for approval
- `PUT /admin/items/<item_id>/approve` - Approve item
- `GET /admin/users` - Get all users

## 🗄 Database Schema

The application uses SQLAlchemy models with the following main entities:

### Users Table
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email address
- `password_hash` - Hashed password
- `phone` - Phone number
- `role` - User role (user/admin)
- `created_at` - Registration timestamp

### Items Table
- `id` - Primary key
- `name` - Item name
- `description` - Item description
- `category` - Item category
- `status` - Item status (lost/found)
);
```

## 🧪 Testing

### Backend Tests
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app tests/

# Run specific test file
pytest tests/test_models.py
```

### Frontend Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test
npm test -- --testNamePattern="UserComponent"
```

## 🚀 Deployment

### Backend Deployment (Heroku)
```bash
# Install Heroku CLI
heroku login

# Create new app
heroku create moringa-lost-found-backend

# Set environment variables
heroku config:set DATABASE_URL=your-production-db-url
heroku config:set JWT_SECRET_KEY=your-production-secret

# Deploy
git push heroku main
```

### Frontend Deployment (Netlify)
```bash
# Build for production
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```
3. **Make your changes**
4. **Add tests**
5. **Commit your changes**
```bash
git commit -m "Add: brief description of changes"
```
6. **Push to your branch**
```bash
git push origin feature/your-feature-name
```
7. **Create a Pull Request**

### Code Style
- Follow PEP 8 for Python
- Use ESLint configuration for JavaScript
- Write meaningful commit messages
- Add tests for new features





## 🙏 Acknowledgments

- Moringa School for providing the platform
- All contributors who helped build this project
- The Moringa community for their feedback and support

---

**Made with ❤️ by the Moringa Lost & Found Team**
