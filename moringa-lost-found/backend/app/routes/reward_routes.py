from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers.reward_controller import RewardController

reward_bp = Blueprint('rewards', __name__, url_prefix='/api/rewards')
reward_controller = RewardController()

@reward_bp.route('/', methods=['POST'])
@jwt_required()
def create_reward():
    """Create a new reward for finding an item"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        required_fields = ['item_id', 'finder_user_id', 'amount', 'phone_number']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        return reward_controller.create_reward(
            data['item_id'],
            data['finder_user_id'],
            data['amount'],
            data['phone_number']
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reward_bp.route('/<int:reward_id>/pay', methods=['POST'])
@jwt_required()
def initiate_payment(reward_id):
    """Initiate M-Pesa payment for reward"""
    try:
        return reward_controller.initiate_mpesa_payment(reward_id)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reward_bp.route('/my-rewards', methods=['GET'])
@jwt_required()
def get_my_rewards():
    """Get rewards for the current user"""
    try:
        user_id = get_jwt_identity()
        return reward_controller.get_user_rewards(user_id)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reward_bp.route('/<int:reward_id>/callback', methods=['POST'])
def mpesa_callback(reward_id):
    """Handle M-Pesa callback for payment status"""
    try:
        data = request.get_json()
        status = data.get('status', 'completed')
        transaction_id = data.get('transaction_id')
        
        return reward_controller.update_reward_status(reward_id, status, transaction_id)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reward_bp.route('/<int:reward_id>', methods=['GET'])
@jwt_required()
def get_reward(reward_id):
    """Get specific reward details"""
    try:
        reward = Reward.query.get(reward_id)
        if not reward:
            return jsonify({'error': 'Reward not found'}), 404
        
        return jsonify({
            'id': reward.id,
            'item': {
                'id': reward.item.id,
                'name': reward.item.name,
                'description': reward.item.description
            },
            'amount': reward.amount,
            'status': reward.status,
            'mpesa_transaction_id': reward.mpesa_transaction_id,
            'mpesa_phone_number': reward.mpesa_phone_number,
            'finder': {
                'id': reward.finder.id,
                'username': reward.finder.username,
                'phone': reward.finder.phone
            },
            'owner': {
                'id': reward.owner.id,
                'username': reward.owner.username,
                'phone': reward.owner.phone
            },
            'created_at': reward.created_at.isoformat()
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
