from flask import request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models.user import User
from app.extensions import db

def signup():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"message": "No JSON data provided"}), 400
            
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        # Validate input data
        if not username or not email or not password:
            return jsonify({"message": "Username, email, and password are required"}), 400

        # Check if username already exists
        if User.query.filter_by(username=username).first():
            return jsonify({"message": "Username already exists"}), 409

        # Check if email already exists
        if User.query.filter_by(email=email).first():
            return jsonify({"message": "Email already exists"}), 409

        # Create new user
        new_user = User(username=username, email=email)
        new_user.set_password(password)
        
        db.session.add(new_user)
        try:
            db.session.commit()
            return jsonify({"message": "User created successfully"}), 201
        except Exception as commit_error:
            db.session.rollback()
            import traceback
            traceback.print_exc()
            return jsonify({"message": "Database commit error", "error": str(commit_error)}), 500

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"message": "Internal server error", "error": str(e)}), 500

def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return jsonify({"message": "Invalid credentials"}), 401
        
        # Use string identity instead of integer
        access_token = create_access_token(identity=str(user.id))
        user_data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "created_at": user.created_at.isoformat() if user.created_at else None
        }
        return jsonify(access_token=access_token, user=user_data), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"message": "Internal server error", "error": str(e)}), 500

def admin_login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    admin = User.query.filter_by(username=username, role="admin").first()
    if not admin or not admin.check_password(password):
        return jsonify({"message": "Invalid credentials"}), 401

    # Use string identity instead of integer
    access_token = create_access_token(identity=str(admin.id))
    return jsonify(access_token=access_token), 200

def admin_signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already exists"}), 409

    hashed_password = generate_password_hash(password)
    new_admin = User(
        username=username,
        email=email,
        password_hash=hashed_password,
        role="admin"  # Key difference from regular signup
    )
    db.session.add(new_admin)
    db.session.commit()
    return jsonify({"message": "Admin account created successfully"}), 201


@jwt_required()
def protected_admin_route():
    return jsonify({"message": "This is a protected admin route"})

def make_admin(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    user.role = "admin"
    db.session.commit()
    return jsonify({"message": f"User {username} is now an admin"}), 200

@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify({"message": "User not found"}), 404
    user_data = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "created_at": user.created_at.isoformat() if user.created_at else None
    }
    return jsonify(user_data), 200


