from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.report import Report, Reward
from app.models.item import Item
from app.models.user import User
import os
import requests
from datetime import datetime

report_reward_bp = Blueprint('report_rewards', __name__, url_prefix='/api/reports')

class ReportRewardController:
    def __init__(self):
        self.mpesa_api_key = os.getenv('MPESA_API_KEY', 'test_key')
        self.mpesa_shortcode = os.getenv('MPESA_SHORTCODE', '174379')
        self.mpesa_passkey = os.getenv('MPESA_PASSKEY', 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919')
        self.mpesa_endpoint = os.getenv('MPESA_ENDPOINT', 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest')

    @jwt_required()
    def create_reward_for_report(self, report_id):
        """Create a reward for a report with MPESA payment"""
        try:
            data = request.get_json()
            current_user_id = get_jwt_identity()
            
            # Validate required fields
            required_fields = ['amount', 'mpesa_phone_number', 'finder_user_id']
            for field in required_fields:
                if field not in data:
                    return jsonify({'error': f'Missing required field: {field}'}), 400
            
            # Get report
            report = Report.query.get(report_id)
            if not report:
                return jsonify({'error': 'Report not found'}), 404
            
            # Check if report already has a reward
            if report.reward:
                return jsonify({'error': 'Reward already exists for this report'}), 400
            
            # Create reward
            reward = Reward(
                item_id=report.item_id,
                report_id=report.id,
                finder_user_id=data['finder_user_id'],
                owner_user_id=current_user_id,
                amount=float(data['amount']),
                mpesa_phone_number=data['mpesa_phone_number']
            )
            
            db.session.add(reward)
            db.session.commit()
            
            # Update report
            report.reward_amount = float(data['amount'])
            report.reward_status = 'offered'
            report.mpesa_phone_number = data['mpesa_phone_number']
            db.session.commit()
            
            return jsonify({
                'message': 'Reward created successfully',
                'reward': {
                    'id': reward.id,
                    'amount': reward.amount,
                    'status': reward.status,
                    'mpesa_phone_number': reward.mpesa_phone_number
                }
            }), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

    @jwt_required()
    def initiate_mpesa_payment(self, report_id):
        """Initiate MPESA payment for a report's reward"""
        try:
            report = Report.query.get(report_id)
            if not report:
                return jsonify({'error': 'Report not found'}), 404
            
            if not report.reward:
                return jsonify({'error': 'No reward found for this report'}), 404
            
            reward = report.reward
            
            if reward.status != 'pending':
                return jsonify({'error': 'Payment already processed'}), 400
            
            # Simulate MPESA payment initiation
            transaction_id = f'MPESA{reward.id}{int(datetime.now().timestamp())}'
            
            reward.status = 'initiated'
            reward.mpesa_transaction_id = transaction_id
            report.reward_status = 'initiated'
            db.session.commit()
            
            return jsonify({
                'message': 'MPESA payment initiated',
                'transaction_id': transaction_id,
                'amount': reward.amount,
                'phone_number': reward.mpesa_phone_number
            }), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

    @jwt_required()
    def get_report_with_reward(self, report_id):
        """Get report details with reward information"""
        try:
            report = Report.query.get(report_id)
            if not report:
                return jsonify({'error': 'Report not found'}), 404
            
            return jsonify({
                'report': {
                    'id': report.id,
                    'item_id': report.item_id,
                    'user_id': report.user_id,
                    'is_approved': report.is_approved,
                    'created_at': report.created_at.isoformat(),
                    'reward': {
                        'id': report.reward.id if report.reward else None,
                        'amount': report.reward.amount if report.reward else None,
                        'status': report.reward.status if report.reward else None,
                        'mpesa_phone_number': report.reward.mpesa_phone_number if report.reward else None,
                        'mpesa_transaction_id': report.reward.mpesa_transaction_id if report.reward else None
                    }
                }
            }), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @jwt_required()
    def get_user_rewards(self):
        """Get rewards for the current user"""
        try:
            user_id = get_jwt_identity()
            
            rewards_given = Reward.query.filter_by(owner_user_id=user_id).all()
            rewards_received = Reward.query.filter_by(finder_user_id=user_id).all()
            
            def format_reward(reward):
                return {
                    'id': reward.id,
                    'item_name': reward.item.name,
                    'amount': reward.amount,
                    'status': reward.status,
                    'mpesa_phone_number': reward.mpesa_phone_number,
                    'mpesa_transaction_id': reward.mpesa_transaction_id,
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
