from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.reward import Reward
from app.models.item import Item
from app.models.user import User
from app.extensions import db
import requests
import os

class RewardController:
    def __init__(self):
        self.mpesa_api_key = os.getenv('MPESA_API_KEY', 'test_key')
        self.mpesa_shortcode = os.getenv('MPESA_SHORTCODE', '174379')
        self.mpesa_passkey = os.getenv('MPESA_PASSKEY', 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919')
        self.mpesa_endpoint = os.getenv('MPESA_ENDPOINT', 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest')

    def create_reward(self, item_id, finder_user_id, amount, phone_number):
        """Create a new reward for finding an item"""
        try:
            item = Item.query.get(item_id)
            if not item:
                return jsonify({'error': 'Item not found'}), 404
            
            if item.status != 'found':
                return jsonify({'error': 'Item must be marked as found to create reward'}), 400
            
            # Check if reward already exists
            existing_reward = Reward.query.filter_by(item_id=item_id).first()
            if existing_reward:
                return jsonify({'error': 'Reward already exists for this item'}), 400
            
            reward = Reward(
                item_id=item_id,
                finder_user_id=finder_user_id,
                owner_user_id=item.user_id,
                amount=amount,
                mpesa_phone_number=phone_number
            )
            
            db.session.add(reward)
            db.session.commit()
            
            return jsonify({
                'message': 'Reward created successfully',
                'reward': {
                    'id': reward.id,
                    'item_id': reward.item_id,
                    'amount': reward.amount,
                    'status': reward.status,
                    'created_at': reward.created_at.isoformat()
                }
            }), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

    def initiate_mpesa_payment(self, reward_id):
        """Initiate M-Pesa payment for reward"""
        try:
            reward = Reward.query.get(reward_id)
            if not reward:
                return jsonify({'error': 'Reward not found'}), 404
            
            if reward.status != 'pending':
                return jsonify({'error': 'Reward payment already processed'}), 400
            
            # In production, this would integrate with M-Pesa API
            # For now, we'll simulate the payment process
            
            # Simulate M-Pesa STK Push
            payment_data = {
                'BusinessShortCode': self.mpesa_shortcode,
                'Password': self.mpesa_passkey,
                'Timestamp': '20240718120000',
                'TransactionType': 'CustomerPayBillOnline',
                'Amount': reward.amount,
                'PartyA': reward.mpesa_phone_number,
                'PartyB': self.mpesa_shortcode,
                'PhoneNumber': reward.mpesa_phone_number,
                'CallBackURL': 'https://your-callback-url.com/mpesa/callback',
                'AccountReference': f'REWARD-{reward.id}',
                'TransactionDesc': f'Reward for finding item {reward.item_id}'
            }
            
            # Simulate successful payment initiation
            reward.status = 'initiated'
            reward.mpesa_transaction_id = f'MPESA{reward.id}{int(time.time())}'
            db.session.commit()
            
            return jsonify({
                'message': 'M-Pesa payment initiated successfully',
                'transaction_id': reward.mpesa_transaction_id,
                'amount': reward.amount,
                'phone_number': reward.mpesa_phone_number
            }), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

    def get_user_rewards(self, user_id):
        """Get rewards for a specific user (both given and received)"""
        try:
            rewards_given = Reward.query.filter_by(owner_user_id=user_id).all()
            rewards_received = Reward.query.filter_by(finder_user_id=user_id).all()
            
            def format_reward(reward):
                return {
                    'id': reward.id,
                    'item_name': reward.item.name,
                    'amount': reward.amount,
                    'status': reward.status,
                    'mpesa_transaction_id': reward.mpesa_transaction_id,
                    'mpesa_phone_number': reward.mpesa_phone_number,
                    'created_at': reward.created_at.isoformat(),
                    'other_party': {
                        'username': reward.finder.username if reward.owner_user_id == user_id else reward.owner.username,
                        'phone': reward.finder.phone if reward.owner_user_id == user_id else reward.owner.phone
                    }
                }
            
            return jsonify({
                'rewards_given': [format_reward(r) for r in rewards_given],
                'rewards_received': [format_reward(r) for r in rewards_received]
            }), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    def update_reward_status(self, reward_id, status, transaction_id=None):
        """Update reward status after M-Pesa callback"""
        try:
            reward = Reward.query.get(reward_id)
            if not reward:
                return jsonify({'error': 'Reward not found'}), 404
            
            reward.status = status
            if transaction_id:
                reward.mpesa_transaction_id = transaction_id
            
            db.session.commit()
            
            return jsonify({
                'message': f'Reward status updated to {status}',
                'reward': {
                    'id': reward.id,
                    'status': reward.status,
                    'transaction_id': reward.mpesa_transaction_id
                }
            }), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
