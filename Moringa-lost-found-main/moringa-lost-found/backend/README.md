# FOLDER STRUCTURE
- /backend/
- │
- ├── app/
- │   ├── __init__.py             
- │   │
- │   ├── controllers/
- │   │   ├── __init__.py
- │   │   ├── auth_controller.py
- │   │   ├── item_controller.py
- │   │   ├── report_controller.py
- │   │   └── user_controller.py
- │   │
- │   ├── models/
- │   │   ├── __init__.py
- │   │   ├── item.py
- │   │   ├── report.py
- │   │   └── user.py
- │   │
- │   └── routes/
- │       ├── __init__.py
- │       ├── auth_routes.py
- │       ├── item_routes.py
- │       ├── report_routes.py
- │       └── user_routes.py
- │
- ├── migrations/
- ├── tests/
- ├── .env
- ├── config.py
- ├── requirements.txt
- └── app.py


# DB schema
![alt text](<Readme_img/Screenshot 2025-07-18 102130.png>)
![alt text](<Readme_img/Screenshot 2025-07-18 102158.png>)
![alt text](<Readme_img/Screenshot 2025-07-18 102228.png>)
![alt text](<Readme_img/Screenshot 2025-07-18 102242.png>)
---
# API endpoints

## 🔐 Authentication Endpoints

- `POST /auth/register`  
  Register a new user account.

- `POST /auth/login`  
  Log in and receive an access token.

- `POST /auth/logout`  
  Invalidate the current user's token.

---

## 👤 User Endpoints

- `GET /items/`  
  Retrieve all found items.

- `GET /items/<item_id>`  
  Get details of a specific found item.

- `POST /reports/`  
  Submit a new lost item report.

- `POST /items/<item_id>/claim`  
  Make a claim on a found item.

- `POST /items/<item_id>/comments`  
  Add a comment to a specific item.

- `GET /items/<item_id>/comments`  
  Get comments associated with a specific item.

---

## 🛠️ Admin Endpoints

- `POST /items/`  
  Add a new item to the found items inventory.

- `PUT /items/<item_id>`  
  Update the details of a found item.

- `DELETE /items/<item_id>`  
  Delete a found item record.

- `GET /reports/`  
  View all lost item reports submitted by users.

- `PUT /reports/<report_id>/approve`  
  Approve a user's lost item report.

- `GET /claims/`  
  View all item claims made by users.

- `PUT /claims/<claim_id>`  
  Update the status of a claim (approve/reject).

---

## ✅ Tech Stack

- Python
- Flask
- SQLAlchemy
- PostgreSQL (recommended)
- JWT Authentication
- Flask-Migrate
- Flask-CORS

---

## 🚧 Setup Instructions (optional section)

```bash
git clone <repo-url>
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask db upgrade
flask run




