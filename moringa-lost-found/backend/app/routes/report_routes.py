from flask import Blueprint
from app.controllers import report_controller

report_bp = Blueprint('report_bp', __name__)

report_bp.route('/claims', methods=['POST'])(report_controller.create_claim)
report_bp.route('/comments', methods=['POST'])(report_controller.add_comment)
report_bp.route('/rewards', methods=['POST'])(report_controller.offer_reward)
report_bp.route('/rewards/<int:user_id>', methods=['GET'])(report_controller.get_user_rewards)
