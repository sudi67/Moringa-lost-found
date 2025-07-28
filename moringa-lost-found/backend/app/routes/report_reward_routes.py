from flask import Blueprint
from app.controllers.report_reward_controller import ReportRewardController

report_reward_bp = Blueprint('report_rewards', __name__, url_prefix='/api/reports')

# Initialize controller
controller = ReportRewardController()

# Routes
report_reward_bp.route('/<int:report_id>/rewards', methods=['POST'])(controller.create_reward_for_report)
report_reward_bp.route('/<int:report_id>/initiate-payment', methods=['POST'])(controller.initiate_mpesa_payment)
report_reward_bp.route('/<int:report_id>', methods=['GET'])(controller.get_report_with_reward)
report_reward_bp.route('/my-rewards', methods=['GET'])(controller.get_user_rewards)
