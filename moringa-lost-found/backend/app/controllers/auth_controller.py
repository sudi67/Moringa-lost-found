from flask import request, jsonify, Blueprint
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token, jwt_required
from app.models.user import User
from app.extensions import db

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already exists"}), 409

    hashed_password = generate_password_hash(password)
    new_user = User(username=username, email=email, password_hash=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
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

@auth_bp.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    admin = User.query.filter_by(username=username, role="admin").first()
    if not admin or not check_password_hash(admin.password_hash, password):
        return jsonify({"message": "Invalid credentials"}), 401

    # Use string identity instead of integer
    access_token = create_access_token(identity=str(admin.id))
    return jsonify(access_token=access_token), 200

@auth_bp.route('/admin/signup', methods=['POST'])
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


@auth_bp.route('/admin/protected', methods=['GET'])
@jwt_required()
def protected_admin_route():
    return jsonify({"message": "This is a protected admin route"})

@auth_bp.route('/make-admin/<username>', methods=['PUT'])
def make_admin(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    user.role = "admin"
    db.session.commit()
    return jsonify({"message": f"User {username} is now an admin"}), 200

from flask_jwt_extended import get_jwt_identity, jwt_required

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already exists"}), 409

    hashed_password = generate_password_hash(password)
    new_user = User(username=username, email=email, password_hash=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
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

@auth_bp.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    admin = User.query.filter_by(username=username, role="admin").first()
    if not admin or not check_password_hash(admin.password_hash, password):
        return jsonify({"message": "Invalid credentials"}), 401

    # Use string identity instead of integer
    access_token = create_access_token(identity=str(admin.id))
    return jsonify(access_token=access_token), 200

@auth_bp.route('/admin/signup', methods=['POST'])
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


@auth_bp.route('/admin/protected', methods=['GET'])
@jwt_required()
def protected_admin_route():
    return jsonify({"message": "This is a protected admin route"})

@auth_bp.route('/make-admin/<username>', methods=['PUT'])
def make_admin(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    user.role = "admin"
    db.session.commit()
    return jsonify({"message": f"User {username} is now an admin"}), 200

@auth_bp.route('/me', methods=['GET'])
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
    return jsonify(user=user_data), 200

@auth_bp.route('/me', methods=['GET'])
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
    return jsonify(user=user_data), 200
