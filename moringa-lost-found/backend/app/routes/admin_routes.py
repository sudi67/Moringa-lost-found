from flask import Blueprint
from app.controllers import item_controller, report_controller

admin_bp = Blueprint('admin_bp', __name__, url_prefix='/admin')

# Admin endpoints
admin_bp.route('/items', methods=['POST'])(item_controller.add_item)
admin_bp.route('/items/<int:item_id>', methods=['PUT'])(item_controller.update_item)
admin_bp.route('/items/<int:item_id>', methods=['DELETE'])(item_controller.delete_item)
admin_bp.route('/items/pending', methods=['GET'])(item_controller.get_pending_items)
admin_bp.route('/reports', methods=['GET'])(report_controller.get_all_reports)
admin_bp.route('/reports/<int:report_id>/approve', methods=['PUT'])(report_controller.approve_report)
admin_bp.route('/claims', methods=['GET'])(report_controller.get_all_claims)
admin_bp.route('/claims/<int:claim_id>', methods=['PUT'])(report_controller.update_claim_status)
