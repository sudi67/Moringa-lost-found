from flask import Blueprint
from app.controllers import item_controller

item_bp = Blueprint('item_bp', __name__)

item_bp.route('/items', methods=['POST'])(item_controller.add_item)
item_bp.route('/items', methods=['GET'])(item_controller.get_all_items)
item_bp.route('/items/<int:item_id>', methods=['PUT'])(item_controller.update_item)
item_bp.route('/items/<int:item_id>', methods=['DELETE'])(item_controller.delete_item)
