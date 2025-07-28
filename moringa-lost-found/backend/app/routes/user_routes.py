from flask import Blueprint
from app.controllers import user_controller

user_bp = Blueprint('user_bp', __name__, url_prefix='/user')

# Public/user endpoints
user_bp.route('/items', methods=['GET'])(user_controller.get_items)
user_bp.route('/items/<int:item_id>', methods=['GET'])(user_controller.get_item_by_id)
user_bp.route('/items/<int:item_id>/comments', methods=['GET'])(user_controller.get_item_comments)
