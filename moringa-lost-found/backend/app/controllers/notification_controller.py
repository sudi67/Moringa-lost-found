from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.notification import Notification
from app.models.user import User
from app.extensions import db

notification_bp = Blueprint('notifications', __name__, url_prefix='/notifications')

def create_notification(user_id, title, message, notification_type='info', item_id=None):
    """
    Helper function to create a notification for a user
    """
    notification = Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=notification_type,
        item_id=item_id
    )
    db.session.add(notification)
    db.session.commit()
    return notification

@notification_bp.route('', methods=['GET'])
@jwt_required()
def get_user_notifications():
    """
    Get all notifications for the current user
    """
    current_user_id = get_jwt_identity()
    try:
        current_user_id = int(current_user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user identity"}), 401
    
    # Get query parameters for filtering
    unread_only = request.args.get('unread_only', 'false').lower() == 'true'
    limit = request.args.get('limit', type=int)
    
    # Build query
    query = Notification.query.filter_by(user_id=current_user_id)
    
    if unread_only:
        query = query.filter_by(is_read=False)
    
    # Order by most recent first
    query = query.order_by(Notification.created_at.desc())
    
    if limit:
        query = query.limit(limit)
    
    notifications = query.all()
    
    return jsonify([notification.to_dict() for notification in notifications]), 200

@notification_bp.route('/<int:notification_id>/read', methods=['PUT'])
@jwt_required()
def mark_notification_as_read(notification_id):
    """
    Mark a specific notification as read
    """
    current_user_id = get_jwt_identity()
    try:
        current_user_id = int(current_user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user identity"}), 401
    
    notification = Notification.query.filter_by(
        id=notification_id, 
        user_id=current_user_id
    ).first_or_404()
    
    notification.is_read = True
    db.session.commit()
    
    return jsonify({
        "message": "Notification marked as read",
        "notification": notification.to_dict()
    }), 200

@notification_bp.route('/mark-all-read', methods=['PUT'])
@jwt_required()
def mark_all_notifications_as_read():
    """
    Mark all notifications as read for the current user
    """
    current_user_id = get_jwt_identity()
    try:
        current_user_id = int(current_user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user identity"}), 401
    
    # Update all unread notifications for the user
    updated_count = Notification.query.filter_by(
        user_id=current_user_id, 
        is_read=False
    ).update({'is_read': True})
    
    db.session.commit()
    
    return jsonify({
        "message": f"Marked {updated_count} notifications as read"
    }), 200

@notification_bp.route('/<int:notification_id>', methods=['DELETE'])
@jwt_required()
def delete_notification(notification_id):
    """
    Delete a specific notification
    """
    current_user_id = get_jwt_identity()
    try:
        current_user_id = int(current_user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user identity"}), 401
    
    notification = Notification.query.filter_by(
        id=notification_id, 
        user_id=current_user_id
    ).first_or_404()
    
    db.session.delete(notification)
    db.session.commit()
    
    return jsonify({"message": "Notification deleted successfully"}), 200

@notification_bp.route('/unread-count', methods=['GET'])
@jwt_required()
def get_unread_count():
    """
    Get the count of unread notifications for the current user
    """
    current_user_id = get_jwt_identity()
    try:
        current_user_id = int(current_user_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid user identity"}), 401
    
    unread_count = Notification.query.filter_by(
        user_id=current_user_id, 
        is_read=False
    ).count()
    
    return jsonify({"unread_count": unread_count}), 200