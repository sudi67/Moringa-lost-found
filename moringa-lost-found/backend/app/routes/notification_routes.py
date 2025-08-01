from flask import Blueprint
from app.controllers import notification_controller

notification_bp = Blueprint('notification_bp', __name__, url_prefix='/notifications')

# User notification endpoints
notification_bp.route('', methods=['GET'])(notification_controller.get_user_notifications)
notification_bp.route('/<int:notification_id>/read', methods=['PUT'])(notification_controller.mark_notification_as_read)
notification_bp.route('/mark-all-read', methods=['PUT'])(notification_controller.mark_all_notifications_as_read)
notification_bp.route('/<int:notification_id>', methods=['DELETE'])(notification_controller.delete_notification)
notification_bp.route('/unread-count', methods=['GET'])(notification_controller.get_unread_count)