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
- [License](#license)

## 🌟 Overview

Moringa Lost & Found is a full-stack web application designed to help the Moringa community manage lost and found items efficiently. The platform includes:

- **Lost Item Reporting**: Users can report lost items with detailed descriptions and photos
- **Found Item Registration**: Finders can register found items for easy matching
- **Reward System**: Users can offer rewards for lost items
- **User Authentication**: Secure login and registration system
- **Real-time Notifications**: Email notifications for item matches
- **Admin Dashboard**: Comprehensive management interface

## ✨ Features

### 🔍 Lost & Found Management
- Report lost items with photos and detailed descriptions
- Register found items with location and finder details
- Search and filter items by category, location, and date
- Match lost items with found items using AI-powered suggestions

### 💰 Reward System
- Create reward offers for lost items
- Secure payment processing for reward claims
- Reward tracking and verification system
- Automated reward distribution upon successful claims

### 👤 User Management
- Secure user registration and authentication
- Profile management with verification
- User roles and permissions (Admin, User, Moderator)
- Activity tracking and reputation system

### 📊 Analytics & Reporting
- Dashboard with key metrics and insights
- Item recovery statistics
- User engagement analytics
- Reward system performance tracking

### 🔔 Notifications
- Email notifications for item matches
- SMS alerts for urgent cases
- In-app notifications for user activities
- Push notifications for mobile users

## 🛠 Tech Stack

### Backend
- **Framework**: Flask (Python)
- **Database**: SQLite (Development) / PostgreSQL (Production)
- **Authentication**: JWT (JSON Web Tokens)
- **ORM**: SQLAlchemy
- **Validation**: Marshmallow
- **Testing**: pytest
- **API Documentation**: Flask-RESTX

### Frontend
- **Framework**: React 18
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Styling**: CSS Modules + Styled Components
- **HTTP Client**: Axios
- **Testing**: Jest + React Testing Library
- **Build Tool**: Vite

### Infrastructure
- **Version Control**: Git
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Hosting**: Heroku (Backend) / Netlify (Frontend)
- **File Storage**: AWS S3
- **Email Service**: SendGrid

## 📁 Project Structure

```
moringa-lost-found/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── extensions.py
│   │   ├── models/
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
│   │       ├── auth_routes.py
│   │       ├── user_routes.py
│   │       ├── item_routes.py
│   │       └── reward_routes.py
│   ├── tests/
│   ├── requirements.txt
│   └── config.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── store/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
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
git clone https://github.com/yourusername/moringa-lost-found.git
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
cp .env.example .env
# Edit .env with your configuration
```

5. **Initialize database**
```bash
python manage.py db init
python manage.py db migrate
python manage.py db upgrade
```

6. **Run the development server**
```bash
python app.py
```

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

## 🔐 Environment Variables

### Backend (.env)
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost/moringa_lost_found
SQLALCHEMY_DATABASE_URI=sqlite:///app.db

# JWT
JWT_SECRET_KEY=your-secret-key-here
JWT_ACCESS_TOKEN_EXPIRES=3600

# Email
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# AWS (for file uploads)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_BUCKET_NAME=moringa-lost-found-uploads

# Redis (for caching)
REDIS_URL=redis://localhost:6379/0

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=your-stripe-public-key
```

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token

### User Endpoints
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Item Endpoints
- `GET /api/items` - Get all items
- `POST /api/items` - Create new item
- `GET /api/items/:id` - Get item by ID
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Reward Endpoints
- `GET /api/rewards` - Get all rewards
- `POST /api/rewards` - Create new reward
- `GET /api/rewards/:id` - Get reward by ID
- `PUT /api/rewards/:id` - Update reward
- `DELETE /api/rewards/:id` - Delete reward

## 🗄 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'user',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Items Table
```sql
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    status VARCHAR(20) DEFAULT 'lost',
    location_found VARCHAR(255),
    date_found DATE,
    image_url VARCHAR(500),
    reported_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Rewards Table
```sql
CREATE TABLE rewards (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'active',
    created_by INTEGER REFERENCES users(id),
    claimed_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email: support@moringa.com or join our Slack channel: #lost-and-found

## 🙏 Acknowledgments

- Moringa School for providing the platform
- All contributors who helped build this project
- The Moringa community for their feedback and support

---

**Made with ❤️ by the Moringa Lost & Found Team**
