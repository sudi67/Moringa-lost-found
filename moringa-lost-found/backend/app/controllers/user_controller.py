from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models.user import User
from app.models.item import Item
from app.models.report import Comment
from app import db

# Register a new user
def register_user():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({"message": "Username or email already exists"}), 400

    user = User(
        username=username,
        email=email,
        password_hash=generate_password_hash(password),
        role="user"
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    }), 201

# Login user and return JWT
def login_user():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username, role="user").first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(identity={"id": user.id, "role": user.role})
    return jsonify({"access_token": access_token, "username": user.username})

# A protected route only accessible to logged-in users
@jwt_required()
def get_user_profile():
    identity = get_jwt_identity()
    user = User.query.get(identity["id"])
    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role
    })

# Get all items
def get_items():
    items = Item.query.all()
    return jsonify([{
        "id": item.id,
        "name": item.name,
        "description": item.description,
        "status": item.status,
        "location_found": item.location_found,
        "created_at": item.created_at.isoformat()
    } for item in items])

# Get item by ID
def get_item_by_id(item_id):
    item = Item.query.get(item_id)
    if not item:
        return jsonify({"message": "Item not found"}), 404
    
    return jsonify({
        "id": item.id,
        "name": item.name,
        "description": item.description,
        "status": item.status,
        "location_found": item.location_found,
        "created_at": item.created_at.isoformat()
    })

# Get comments for an item
def get_item_comments(item_id):
    comments = Comment.query.filter_by(item_id=item_id).all()
    return jsonify([{
        "id": comment.id,
        "comment_text": comment.comment_text,
        "author_id": comment.author_id,
        "created_at": comment.created_at.isoformat()
    } for comment in comments])
