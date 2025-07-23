from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.item import Item
from app.models.user import User
from app.extensions import db

item_bp = Blueprint('items', __name__, url_prefix='/items')

@item_bp.route('', methods=['POST'])
@jwt_required()
def add_item():
    data = request.get_json()
    current_user_id = get_jwt_identity()

    if not data or not data.get('name'):
        return jsonify({"error": "Name is required"}), 400

    item = Item(
        name=data['name'],
        description=data.get('description'),
        status=data.get('status', 'lost'),
        location_found=data.get('location_found'),
        image_url=data.get('image_url'),
        reported_by=current_user_id
    )

    db.session.add(item)
    db.session.commit()
    return jsonify({"message": "Item added successfully."}), 201

@item_bp.route('/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_item(item_id):
    item = Item.query.get_or_404(item_id)
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    # Allow update if the user is the owner OR an admin
    if item.reported_by != current_user_id and (not current_user or current_user.role != 'admin'):
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    if not data:
        return jsonify({"error": "No input provided"}), 400

    item.name = data.get('name', item.name)
    item.description = data.get('description', item.description)
    item.status = data.get('status', item.status)
    item.image_url = data.get('image_url', item.image_url)
    item.location_found = data.get('location_found', item.location_found)

    db.session.commit()
    return jsonify({"message": "Item updated successfully."}), 200

@item_bp.route('/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_item(item_id):
    item = Item.query.get_or_404(item_id)
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    # Allow delete if the user is the owner OR an admin
    if item.reported_by != current_user_id and (not current_user or current_user.role != 'admin'):
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Item deleted."}), 200

@item_bp.route('', methods=['GET'])
def get_all_items():
    items = Item.query.all()
    result = [{
        "id": item.id,
        "name": item.name,
        "status": item.status,
        "description": item.description,
        "location_found": item.location_found,
        "reported_by": item.reported_by
    } for item in items]
    return jsonify(result), 200
