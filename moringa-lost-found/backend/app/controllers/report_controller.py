from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.report import Claim, Comment
from app.models.reward import Reward
from app.models.item import Item
from app.extensions import db
from app.models.user import User

report_bp = Blueprint('reports', __name__, url_prefix='/reports')

@report_bp.route('/create', methods=['POST'])
@jwt_required()
def create_report():
    try:
        data = request.get_json()
        current_user_id = get_jwt_identity()
        
        # Convert string user ID to integer
        try:
            current_user_id = int(current_user_id)
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid user identity"}), 401

        required_fields = ['title', 'description', 'item_type']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "title, description, and item_type are required"}), 400

        # Create new item/report
        item = Item(
            name=data['title'],  # Use 'name' field from model
            description=data['description'],
            status=data.get('status', 'lost'),  # Default to 'lost'
            location_found=data.get('location'),  # Use 'location_found' field
            reported_by=current_user_id,  # Use 'reported_by' field
            image_url=data.get('image_url')
        )
        
        db.session.add(item)
        db.session.commit()
        
        return jsonify({
            "message": "Report created successfully",
            "item": {
                "id": item.id,
                "name": item.name,
                "description": item.description,
                "status": item.status,
                "location_found": item.location_found,
                "created_at": item.created_at.isoformat()
            }
        }), 201
    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@report_bp.route('/claims', methods=['POST'])
@jwt_required()
def create_claim():
    data = request.get_json()
    current_user_id = get_jwt_identity()

    if not data or not data.get('item_id'):
        return jsonify({"error": "item_id is required"}), 400

    claim = Claim(
        item_id=data['item_id'],
        user_id=current_user_id,
        status=data.get('status', 'pending')
    )
    db.session.add(claim)
    db.session.commit()
    return jsonify({"message": "Claim submitted."}), 201

@report_bp.route('/comments', methods=['POST'])
@jwt_required()
def add_comment():
    data = request.get_json()
    current_user_id = get_jwt_identity()

    if not data or not data.get('item_id') or not data.get('content'):
        return jsonify({"error": "item_id and content are required"}), 400

    comment = Comment(
        user_id=current_user_id,
        item_id=data['item_id'],
        content=data['content']
    )
    db.session.add(comment)
    db.session.commit()
    return jsonify({"message": "Comment added."}), 201

@report_bp.route('/rewards', methods=['POST'])
@jwt_required()
def offer_reward():
    data = request.get_json()
    current_user_id = get_jwt_identity()

    required = ['item_id', 'receiver_id', 'amount']
    if not all(field in data for field in required):
        return jsonify({"error": "item_id, receiver_id, and amount are required"}), 400

    reward = Reward(
        item_id=data['item_id'],
        sender_id=current_user_id,
        receiver_id=data['receiver_id'],
        amount=data['amount'],
        paid=data.get('paid', False)
    )
    db.session.add(reward)
    db.session.commit()
    return jsonify({"message": "Reward offered."}), 201

@report_bp.route('/rewards', methods=['GET'])
@jwt_required()
def get_user_rewards():
    current_user_id = get_jwt_identity()
    sent = Reward.query.filter_by(sender_id=current_user_id).all()
    received = Reward.query.filter_by(receiver_id=current_user_id).all()

    return jsonify({
        "sent": [{"item_id": r.item_id, "amount": r.amount, "paid": r.paid} for r in sent],
        "received": [{"item_id": r.item_id, "amount": r.amount, "paid": r.paid} for r in received]
    }), 200

# Admin methods
@report_bp.route('/<int:report_id>/approve', methods=['PUT'])
@jwt_required()
def approve_report(report_id):
    # Check if user is admin
    current_user_id = get_jwt_identity()
    try:
        current_user_id = int(current_user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user identity"}), 401
    
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Debug: Log the user role
    print(f"User ID: {current_user_id}, Role: {user.role}")
    
    if user.role != 'admin':
        return jsonify({"error": "Admin access required", "user_role": user.role}), 403
    
    item = Item.query.get(report_id)
    if not item:
        return jsonify({"message": "Report not found"}), 404
    
    item.status = "approved"
    db.session.commit()
    return jsonify({"message": "Report approved successfully"})

@report_bp.route('/admin/reports', methods=['GET'])
@jwt_required()
def get_all_reports():
    # Check if user is admin
    current_user_id = get_jwt_identity()
    try:
        current_user_id = int(current_user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user identity"}), 401
    
    user = User.query.get(current_user_id)
    if not user or user.role != 'admin':
        return jsonify({"error": "Admin access required"}), 403
    
    items = Item.query.all()
    lost_items = []
    found_items = []
    for item in items:
        item_data = {
        "id": item.id,
        "name": item.name,
        "description": item.description,
        "status": item.status,
        "created_at": item.created_at.isoformat()
        }
        if item.status == 'lost':
            lost_items.append(item_data)
        elif item.status == 'found':
            found_items.append(item_data)
    return jsonify({
        "lost_items": lost_items,
        "found_items": found_items
    })

@report_bp.route('/admin/claims', methods=['GET'])
@jwt_required()
def get_all_claims():
    # Check if user is admin
    current_user_id = get_jwt_identity()
    try:
        current_user_id = int(current_user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user identity"}), 401
    
    user = User.query.get(current_user_id)
    if not user or user.role != 'admin':
        return jsonify({"error": "Admin access required"}), 403
    
    claims = Claim.query.all()
    return jsonify([{
        "id": claim.id,
        "item_id": claim.item_id,
        "claimant_id": claim.claimant_id,
        "status": claim.status,
        "created_at": claim.created_at.isoformat()
    } for claim in claims])

@report_bp.route('/admin/claims/<int:claim_id>', methods=['PUT'])
@jwt_required()
def update_claim_status(claim_id):
    # Check if user is admin
    current_user_id = get_jwt_identity()
    try:
        current_user_id = int(current_user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user identity"}), 401
    
    user = User.query.get(current_user_id)
    if not user or user.role != 'admin':
        return jsonify({"error": "Admin access required"}), 403
    
    data = request.get_json()
    claim = Claim.query.get(claim_id)
    
    if not claim:
        return jsonify({"message": "Claim not found"}), 404
    
    claim.status = data.get('status', claim.status)
    db.session.commit()
    return jsonify({"message": "Claim status updated successfully"})
