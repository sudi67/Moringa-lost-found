from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.item import Item
from app.models.user import User
from app.models.report import Claim, Comment
from app.models.reward import Reward
from app.extensions import db

item_bp = Blueprint('items', __name__, url_prefix='/items')

@item_bp.route('', methods=['OPTIONS'])
def options_add_item():
    return '', 200

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
        category=data.get('category', 'other'),
        location_found=data.get('location_found'),
        image_url=data.get('image_url'),
        reported_by=current_user_id
    )

    db.session.add(item)
    db.session.commit()
    return jsonify({"message": "Item added successfully."}), 201

@item_bp.route('/<int:item_id>', methods=['GET'])
def get_item(item_id):
    item = Item.query.get_or_404(item_id)
    return jsonify({
        "id": item.id,
        "name": item.name,
        "status": item.status,
        "approval_status": item.approval_status,
        "description": item.description,
        "location_found": item.location_found,
        "reported_by": item.reported_by,
        "created_at": item.created_at.isoformat() if item.created_at else None,
        "image_url": item.image_url,
        "category": item.category
    }), 200

@item_bp.route('/<int:item_id>', methods=['OPTIONS'])
def options_update_item(item_id):
    return '', 200

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

@item_bp.route('/<int:item_id>', methods=['OPTIONS'])
def options_delete_item(item_id):
    return '', 200

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
    # Only show approved items to regular users
    items = Item.query.filter_by(approval_status='approved').all()
    result = [{
        "id": item.id,
        "name": item.name,
        "status": item.status,
        "approval_status": item.approval_status,
        "description": item.description,
        "location_found": item.location_found,
        "reported_by": item.reported_by,
        "created_at": item.created_at.isoformat() if item.created_at else None,
        "image_url": item.image_url,
        "category": item.category
    } for item in items]
    return jsonify(result), 200

@item_bp.route('/my-items', methods=['OPTIONS'])
def options_get_my_items():
    return '', 200

@item_bp.route('/my-items', methods=['GET'])
@jwt_required()
def get_my_items():
    current_user_id = get_jwt_identity()
    
    # Convert string user ID to integer if needed
    try:
        current_user_id = int(current_user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user identity"}), 401
    
    # Get all items reported by the current user
    items = Item.query.filter_by(reported_by=current_user_id).all()
    
    result = [{
        "id": item.id,
        "name": item.name,
        "status": item.status,
        "approval_status": item.approval_status,
        "description": item.description,
        "location_found": item.location_found,
        "reported_by": item.reported_by,
        "created_at": item.created_at.isoformat() if item.created_at else None,
        "image_url": item.image_url,
        "category": item.category
    } for item in items]
    
    return jsonify(result), 200

@item_bp.route('/<int:item_id>/claim', methods=['OPTIONS'])
def options_claim_item(item_id):
    return '', 200

@item_bp.route('/<int:item_id>/claim', methods=['POST'])
@jwt_required()
def claim_item(item_id):
    data = request.get_json()
    current_user_id = get_jwt_identity()
    
    # Convert string user ID to integer if needed
    try:
        current_user_id = int(current_user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user identity"}), 401

    item = Item.query.get_or_404(item_id)
    
    # Check if item is available for claiming
    if item.status == 'claimed':
        return jsonify({"error": "Item has already been claimed"}), 400
    
    # Create a claim
    claim = Claim(
        item_id=item_id,
        claimant_id=current_user_id,  # Use 'claimant_id' instead of 'user_id'
        status='pending'
    )
    
    db.session.add(claim)
    db.session.commit()
    
    return jsonify({
        "message": "Claim submitted successfully",
        "claim": {
            "id": claim.id,
            "item_id": claim.item_id,
            "claimant_id": claim.claimant_id,  # Use 'claimant_id' in response
            "status": claim.status,
            "created_at": claim.created_at.isoformat()
        }
    }), 201

@item_bp.route('/<int:item_id>/comments', methods=['OPTIONS'])
def options_comment_item(item_id):
    return '', 200

@item_bp.route('/<int:item_id>/comments', methods=['POST'])
@jwt_required()
def comment_item(item_id):
    data = request.get_json()
    current_user_id = get_jwt_identity()
    
    # Convert string user ID to integer if needed
    try:
        current_user_id = int(current_user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user identity"}), 401

    if not data or not data.get('content'):
        return jsonify({"error": "content is required"}), 400

    item = Item.query.get_or_404(item_id)
    
    # Create a comment
    comment = Comment(
        item_id=item_id,
        author_id=current_user_id,  # Use 'author_id' from Comment model
        comment_text=data['content']  # Use 'comment_text' from Comment model
    )
    
    db.session.add(comment)
    db.session.commit()
    
    return jsonify({
        "message": "Comment added successfully",
        "comment": {
            "id": comment.id,
            "item_id": comment.item_id,
            "author_id": comment.author_id,
            "comment_text": comment.comment_text,
            "created_at": comment.created_at.isoformat()
        }
    }), 201

@item_bp.route('/<int:item_id>/comments', methods=['GET'])
def get_item_comments(item_id):
    comments = Comment.query.filter_by(item_id=item_id).all()
    return jsonify([{
        "id": comment.id,
        "author_id": comment.author_id,
        "comment_text": comment.comment_text,
        "created_at": comment.created_at.isoformat()
    } for comment in comments]), 200

@item_bp.route('/<int:item_id>/rewards', methods=['OPTIONS'])
def options_offer_reward(item_id):
    return '', 200

@item_bp.route('/<int:item_id>/rewards', methods=['POST'])
@jwt_required()
def offer_reward(item_id):
    data = request.get_json()
    current_user_id = get_jwt_identity()
    
    # Convert string user ID to integer if needed
    try:
        current_user_id = int(current_user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user identity"}), 401

    required_fields = ['amount', 'owner_user_id']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "amount and owner_user_id are required"}), 400

    item = Item.query.get_or_404(item_id)
    
    # Create a reward offer
    reward = Reward(
        item_id=item_id,
        owner_user_id=data['owner_user_id'],
        amount=data['amount']
    )
    
    db.session.add(reward)
    db.session.commit()
    
    return jsonify({
        "message": "Reward offered successfully",
        "reward": {
            "id": reward.id,
            "item_id": reward.item_id,
            "owner_user_id": reward.owner_user_id,
            "amount": reward.amount,
            "status": reward.status,
            "created_at": reward.created_at.isoformat()
        }
    }), 201

@item_bp.route('/<int:item_id>/rewards', methods=['GET'])
def get_item_rewards(item_id):
    rewards = Reward.query.filter_by(item_id=item_id).all()
    return jsonify([{
        "id": reward.id,
        "owner_user_id": reward.owner_user_id,
        "amount": reward.amount,
        "status": reward.status,
        "created_at": reward.created_at.isoformat()
    } for reward in rewards]), 200

@item_bp.route('/admin/add/<int:item_id>', methods=['OPTIONS'])
def options_admin_add_item_to_inventory(item_id):
    return '', 200

@item_bp.route('/admin/add/<int:item_id>', methods=['POST'])
@jwt_required()
def admin_add_item_to_inventory(item_id):
    # Check if user is admin
    current_user_id = get_jwt_identity()
    try:
        current_user_id = int(current_user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user identity"}), 401
    
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    if user.role != 'admin':
        return jsonify({"error": "Admin access required"}), 403
    
    # Get the item that needs to be added to inventory
    item = Item.query.get_or_404(item_id)
    
    # Check if item is approved
    if item.status != 'approved':
        return jsonify({"error": "Item must be approved before adding to inventory"}), 400
    
    # Check if item is already in inventory (status = 'found')
    if item.status == 'found':
        return jsonify({"error": "Item is already in inventory"}), 400
    
    # Update item status to 'found' (in inventory)
    item.status = 'found'
    db.session.commit()
    
    return jsonify({
        "message": "Item successfully added to inventory",
        "item": {
            "id": item.id,
            "name": item.name,
            "description": item.description,
            "status": item.status,
            "location_found": item.location_found,
            "image_url": item.image_url,
            "reported_by": item.reported_by,
            "created_at": item.created_at.isoformat()
        }
    }), 200

@item_bp.route('/admin/<int:item_id>/update', methods=['OPTIONS'])
def options_admin_update_item(item_id):
    return '', 200

@item_bp.route('/admin/<int:item_id>/update', methods=['PUT'])
@jwt_required()
def admin_update_item(item_id):
    # Check if user is admin
    current_user_id = get_jwt_identity()
    try:
        current_user_id = int(current_user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user identity"}), 401
    
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    if user.role != 'admin':
        return jsonify({"error": "Admin access required"}), 403
    
    item = Item.query.get_or_404(item_id)
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No input provided"}), 400

    # Update item fields
    if 'name' in data:
        item.name = data['name']
    if 'description' in data:
        item.description = data['description']
    if 'status' in data:
        item.status = data['status']
    if 'location_found' in data:
        item.location_found = data['location_found']
    if 'image_url' in data:
        item.image_url = data['image_url']

    db.session.commit()
    
    return jsonify({
        "message": "Item updated successfully",
        "item": {
            "id": item.id,
            "name": item.name,
            "description": item.description,
            "status": item.status,
            "location_found": item.location_found,
            "image_url": item.image_url,
            "reported_by": item.reported_by,
            "created_at": item.created_at.isoformat()
        }
    }), 200

@item_bp.route('/admin/<int:item_id>/remove', methods=['OPTIONS'])
def options_admin_remove_item(item_id):
    return '', 200

@item_bp.route('/admin/<int:item_id>/remove', methods=['DELETE'])
@jwt_required()
def admin_remove_item(item_id):
    # Check if user is admin
    current_user_id = get_jwt_identity()
    try:
        current_user_id = int(current_user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user identity"}), 401
    
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    if user.role != 'admin':
        return jsonify({"error": "Admin access required"}), 403
    
    item = Item.query.get_or_404(item_id)
    
    # Store item info before deletion for response
    item_info = {
        "id": item.id,
        "name": item.name,
        "status": item.status,
        "description": item.description,
        "location_found": item.location_found
    }
    
    # Delete related records first to avoid foreign key constraint violations
    # Delete rewards associated with this item
    Reward.query.filter_by(item_id=item_id).delete()
    
    # Delete claims associated with this item
    Claim.query.filter_by(item_id=item_id).delete()
    
    # Delete comments associated with this item
    Comment.query.filter_by(item_id=item_id).delete()
    
    # Delete reports associated with this item
    from app.models.report import Report
    Report.query.filter_by(item_id=item_id).delete()
    
    # Now delete the item
    db.session.delete(item)
    db.session.commit()
    
    return jsonify({
        "message": "Item removed from inventory successfully",
        "removed_item": item_info
    }), 200

@item_bp.route('/admin/found-items', methods=['OPTIONS'])
def options_admin_view_found_items():
    return '', 200

@item_bp.route('/admin/found-items', methods=['GET'])
@jwt_required()
def admin_view_found_items():
    # Check if user is admin
    current_user_id = get_jwt_identity()
    try:
        current_user_id = int(current_user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user identity"}), 401
    
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    if user.role != 'admin':
        return jsonify({"error": "Admin access required"}), 403
    
    # Get all found items with detailed information
    found_items = Item.query.filter_by(status='found').all()
    
    items_data = []
    for item in found_items:
        # Get associated claims for this item
        claims = Claim.query.filter_by(item_id=item.id).all()
        claims_data = [{
            "id": claim.id,
            "claimant_id": claim.claimant_id,
            "status": claim.status,
            "created_at": claim.created_at.isoformat()
        } for claim in claims]
        
        # Get associated comments for this item
        comments = Comment.query.filter_by(item_id=item.id).all()
        comments_data = [{
            "id": comment.id,
            "author_id": comment.author_id,
            "comment_text": comment.comment_text,
            "created_at": comment.created_at.isoformat()
        } for comment in comments]
        
        # Get associated rewards for this item
        rewards = Reward.query.filter_by(item_id=item.id).all()
        rewards_data = [{
            "id": reward.id,
            "owner_user_id": reward.owner_user_id,
            "amount": reward.amount,
            "status": reward.status,
            "created_at": reward.created_at.isoformat()
        } for reward in rewards]
        
        # Get reporter information
        reporter = User.query.get(item.reported_by)
        reporter_info = {
            "id": reporter.id,
            "username": reporter.username,
            "email": reporter.email
        } if reporter else None
        
        item_data = {
            "id": item.id,
            "name": item.name,
            "description": item.description,
            "status": item.status,
            "location_found": item.location_found,
            "image_url": item.image_url,
            "reported_by": reporter_info,
            "created_at": item.created_at.isoformat(),
            "claims": claims_data,
            "comments": comments_data,
            "rewards": rewards_data,
            "total_claims": len(claims_data),
            "total_comments": len(comments_data),
            "total_rewards": len(rewards_data)
        }
        items_data.append(item_data)
    
    return jsonify({
        "message": f"Found {len(items_data)} items",
        "found_items": items_data,
        "total_count": len(items_data)
    }), 200

@item_bp.route('/admin/inventory', methods=['OPTIONS'])
def options_admin_view_inventory():
    return '', 200

@item_bp.route('/admin/inventory', methods=['GET'])
@jwt_required()
def admin_view_inventory():
    # Check if user is admin
    current_user_id = get_jwt_identity()
    try:
        current_user_id = int(current_user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user identity"}), 401
    
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    if user.role != 'admin':
        return jsonify({"error": "Admin access required"}), 403
    
    # Get all items in inventory (status = 'found')
    inventory_items = Item.query.filter_by(status='found').all()
    
    items_data = []
    for item in inventory_items:
        # Get associated claims for this item
        claims = Claim.query.filter_by(item_id=item.id).all()
        claims_data = [{
            "id": claim.id,
            "claimant_id": claim.claimant_id,
            "status": claim.status,
            "created_at": claim.created_at.isoformat()
        } for claim in claims]
        
        # Get associated comments for this item
        comments = Comment.query.filter_by(item_id=item.id).all()
        comments_data = [{
            "id": comment.id,
            "author_id": comment.author_id,
            "comment_text": comment.comment_text,
            "created_at": comment.created_at.isoformat()
        } for comment in comments]
        
        # Get associated rewards for this item
        rewards = Reward.query.filter_by(item_id=item.id).all()
        rewards_data = [{
            "id": reward.id,
            "offered_by_id": reward.offered_by_id,
            "paid_to_id": reward.paid_to_id,
            "amount": reward.amount,
            "status": reward.status,
            "created_at": reward.created_at.isoformat()
        } for reward in rewards]
        
        # Get reporter information
        reporter = User.query.get(item.reported_by)
        reporter_info = {
            "id": reporter.id,
            "username": reporter.username,
            "email": reporter.email
        } if reporter else None
        
        item_data = {
            "id": item.id,
            "name": item.name,
            "description": item.description,
            "status": item.status,
            "location_found": item.location_found,
            "image_url": item.image_url,
            "reported_by": reporter_info,
            "created_at": item.created_at.isoformat(),
            "claims": claims_data,
            "comments": comments_data,
            "rewards": rewards_data,
            "total_claims": len(claims_data),
            "total_comments": len(comments_data),
            "total_rewards": len(rewards_data)
        }
        items_data.append(item_data)
    
    return jsonify({
        "message": f"Inventory contains {len(items_data)} items",
        "inventory_items": items_data,
        "total_count": len(items_data)
    }), 200

@item_bp.route('/admin/claimed-items', methods=['OPTIONS'])
def options_admin_view_claimed_items():
    return '', 200

@item_bp.route('/admin/claimed-items', methods=['GET'])
@jwt_required()
def admin_view_claimed_items():
    # Check if user is admin
    current_user_id = get_jwt_identity()
    try:
        current_user_id = int(current_user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user identity"}), 401
    
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    if user.role != 'admin':
        return jsonify({"error": "Admin access required"}), 403
    
    # Get all claimed items with detailed information
    claimed_items = Item.query.filter_by(status='claimed').all()
    
    items_data = []
    for item in claimed_items:
        # Get associated claims for this item
        claims = Claim.query.filter_by(item_id=item.id).all()
        claims_data = [{
            "id": claim.id,
            "claimant_id": claim.claimant_id,
            "status": claim.status,
            "created_at": claim.created_at.isoformat()
        } for claim in claims]
        
        # Get associated comments for this item
        comments = Comment.query.filter_by(item_id=item.id).all()
        comments_data = [{
            "id": comment.id,
            "author_id": comment.author_id,
            "comment_text": comment.comment_text,
            "created_at": comment.created_at.isoformat()
        } for comment in comments]
        
        # Get associated rewards for this item
        rewards = Reward.query.filter_by(item_id=item.id).all()
        rewards_data = [{
            "id": reward.id,
            "owner_user_id": reward.owner_user_id,
            "amount": reward.amount,
            "status": reward.status,
            "created_at": reward.created_at.isoformat()
        } for reward in rewards]
        
        # Get reporter information
        reporter = User.query.get(item.reported_by)
        reporter_info = {
            "id": reporter.id,
            "username": reporter.username,
            "email": reporter.email
        } if reporter else None
        
        # Get claimant information (the person who claimed the item)
        claimant_info = None
        if claims_data:
            # Get the approved claim
            approved_claim = next((claim for claim in claims if claim.status == 'approved'), None)
            if approved_claim:
                claimant = User.query.get(approved_claim.claimant_id)
                claimant_info = {
                    "id": claimant.id,
                    "username": claimant.username,
                    "email": claimant.email
                } if claimant else None
        
        item_data = {
            "id": item.id,
            "name": item.name,
            "description": item.description,
            "status": item.status,
            "location_found": item.location_found,
            "image_url": item.image_url,
            "reported_by": reporter_info,
            "claimed_by": claimant_info,
            "created_at": item.created_at.isoformat(),
            "claims": claims_data,
            "comments": comments_data,
            "rewards": rewards_data,
            "total_claims": len(claims_data),
            "total_comments": len(comments_data),
            "total_rewards": len(rewards_data)
        }
        items_data.append(item_data)
    
    return jsonify({
        "message": f"Found {len(items_data)} claimed items",
        "claimed_items": items_data,
        "total_count": len(items_data)
    }), 200

@item_bp.route('/admin/pending-items', methods=['OPTIONS'])
def options_admin_view_pending_items():
    return '', 200

@item_bp.route('/admin/pending-items', methods=['GET'])
@jwt_required()
def admin_view_pending_items():
    # Check if user is admin
    current_user_id = get_jwt_identity()
    try:
        current_user_id = int(current_user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user identity"}), 401
    
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    if user.role != 'admin':
        return jsonify({"error": "Admin access required"}), 403
    
    # Get all pending items
    pending_items = Item.query.filter_by(approval_status='pending').all()
    
    items_data = []
    for item in pending_items:
        # Get reporter information
        reporter = User.query.get(item.reported_by)
        reporter_info = {
            "id": reporter.id,
            "username": reporter.username,
            "email": reporter.email
        } if reporter else None
        
        item_data = {
            "id": item.id,
            "name": item.name,
            "description": item.description,
            "status": item.status,
            "approval_status": item.approval_status,
            "location_found": item.location_found,
            "image_url": item.image_url,
            "category": item.category,
            "reported_by": reporter_info,
            "created_at": item.created_at.isoformat()
        }
        items_data.append(item_data)
    
    return jsonify({
        "message": f"Found {len(items_data)} pending items",
        "pending_items": items_data,
        "total_count": len(items_data)
    }), 200

@item_bp.route('/admin/<int:item_id>/approve', methods=['OPTIONS'])
def options_admin_approve_item(item_id):
    return '', 200

@item_bp.route('/admin/<int:item_id>/approve', methods=['PUT'])
@jwt_required()
def admin_approve_item(item_id):
    # Check if user is admin
    current_user_id = get_jwt_identity()
    try:
        current_user_id = int(current_user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user identity"}), 401
    
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    if user.role != 'admin':
        return jsonify({"error": "Admin access required"}), 403
    
    item = Item.query.get_or_404(item_id)
    
    # Update approval status to approved
    item.approval_status = 'approved'
    db.session.commit()
    
    return jsonify({
        "message": "Item approved successfully",
        "item": {
            "id": item.id,
            "name": item.name,
            "description": item.description,
            "status": item.status,
            "approval_status": item.approval_status,
            "location_found": item.location_found,
            "image_url": item.image_url,
            "category": item.category,
            "reported_by": item.reported_by,
            "created_at": item.created_at.isoformat()
        }
    }), 200

@item_bp.route('/admin/<int:item_id>/reject', methods=['OPTIONS'])
def options_admin_reject_item(item_id):
    return '', 200

@item_bp.route('/admin/<int:item_id>/reject', methods=['PUT'])
@jwt_required()
def admin_reject_item(item_id):
    # Check if user is admin
    current_user_id = get_jwt_identity()
    try:
        current_user_id = int(current_user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user identity"}), 401
    
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    if user.role != 'admin':
        return jsonify({"error": "Admin access required"}), 403
    
    item = Item.query.get_or_404(item_id)
    
    # Update approval status to rejected
    item.approval_status = 'rejected'
    db.session.commit()
    
    return jsonify({
        "message": "Item rejected successfully",
        "item": {
            "id": item.id,
            "name": item.name,
            "description": item.description,
            "status": item.status,
            "approval_status": item.approval_status,
            "location_found": item.location_found,
            "image_url": item.image_url,
            "category": item.category,
            "reported_by": item.reported_by,
            "created_at": item.created_at.isoformat()
        }
    }), 200

@item_bp.route('/admin/claims/<int:claim_id>/approve', methods=['OPTIONS'])
def options_admin_approve_claim(claim_id):
    return '', 200

@item_bp.route('/admin/claims/<int:claim_id>/approve', methods=['PUT'])
@jwt_required()
def admin_approve_claim(claim_id):
    # Check if user is admin
    current_user_id = get_jwt_identity()
    try:
        current_user_id = int(current_user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user identity"}), 401
    
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    if user.role != 'admin':
        return jsonify({"error": "Admin access required"}), 403
    
    claim = Claim.query.get_or_404(claim_id)
    item = Item.query.get_or_404(claim.item_id)
    
    # Update claim status to approved
    claim.status = 'approved'
    
    # Update item status to claimed
    item.status = 'claimed'
    
    # Reject all other pending claims for this item
    other_claims = Claim.query.filter_by(item_id=claim.item_id).filter(Claim.id != claim_id).all()
    for other_claim in other_claims:
        if other_claim.status == 'pending':
            other_claim.status = 'rejected'
    
    db.session.commit()
    
    return jsonify({
        "message": "Claim approved successfully",
        "claim": {
            "id": claim.id,
            "item_id": claim.item_id,
            "claimant_id": claim.claimant_id,
            "status": claim.status,
            "created_at": claim.created_at.isoformat()
        },
        "item": {
            "id": item.id,
            "name": item.name,
            "status": item.status,
            "approval_status": item.approval_status
        }
    }), 200

@item_bp.route('/admin/claims/<int:claim_id>/reject', methods=['OPTIONS'])
def options_admin_reject_claim(claim_id):
    return '', 200

@item_bp.route('/admin/claims/<int:claim_id>/reject', methods=['PUT'])
@jwt_required()
def admin_reject_claim(claim_id):
    # Check if user is admin
    current_user_id = get_jwt_identity()
    try:
        current_user_id = int(current_user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user identity"}), 401
    
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    if user.role != 'admin':
        return jsonify({"error": "Admin access required"}), 403
    
    claim = Claim.query.get_or_404(claim_id)
    
    # Update claim status to rejected
    claim.status = 'rejected'
    db.session.commit()
    
    return jsonify({
        "message": "Claim rejected successfully",
        "claim": {
            "id": claim.id,
            "item_id": claim.item_id,
            "claimant_id": claim.claimant_id,
            "status": claim.status,
            "created_at": claim.created_at.isoformat()
        }
    }), 200

@item_bp.route('/admin/pending-claims', methods=['OPTIONS'])
def options_admin_view_pending_claims():
    return '', 200

@item_bp.route('/admin/pending-claims', methods=['GET'])
@jwt_required()
def admin_view_pending_claims():
    # Check if user is admin
    current_user_id = get_jwt_identity()
    try:
        current_user_id = int(current_user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user identity"}), 401
    
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    if user.role != 'admin':
        return jsonify({"error": "Admin access required"}), 403
    
    # Get all pending claims with item and claimant details
    pending_claims = Claim.query.filter_by(status='pending').all()
    
    claims_data = []
    for claim in pending_claims:
        # Get item information
        item = Item.query.get(claim.item_id)
        item_info = {
            "id": item.id,
            "name": item.name,
            "description": item.description,
            "status": item.status,
            "approval_status": item.approval_status,
            "location_found": item.location_found,
            "image_url": item.image_url,
            "category": item.category
        } if item else None
        
        # Get claimant information
        claimant = User.query.get(claim.claimant_id)
        claimant_info = {
            "id": claimant.id,
            "username": claimant.username,
            "email": claimant.email
        } if claimant else None
        
        claim_data = {
            "id": claim.id,
            "item_id": claim.item_id,
            "claimant_id": claim.claimant_id,
            "status": claim.status,
            "created_at": claim.created_at.isoformat(),
            "item": item_info,
            "claimant": claimant_info
        }
        claims_data.append(claim_data)
    
    return jsonify({
        "message": f"Found {len(claims_data)} pending claims",
        "pending_claims": claims_data,
        "total_count": len(claims_data)
    }), 200
