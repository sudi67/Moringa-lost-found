from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.report import Claim, Comment, Reward
from app.extensions import db

report_bp = Blueprint('reports', __name__, url_prefix='/reports')

@report_bp.route('/claims', methods=['POST'])
@jwt_required()
def create_claim():
    data = request.get_json()
    current_user_id = get_jwt_identity()

    if not data or not data.get('item_id'):
        return jsonify({"error": "item_id is required"}), 400

    claim = Claim(
        item_id=data['item_id'],
        user_id=current_user_id,
        status=data.get('status', 'pending')
    )
    db.session.add(claim)
    db.session.commit()
    return jsonify({"message": "Claim submitted."}), 201

@report_bp.route('/comments', methods=['POST'])
@jwt_required()
def add_comment():
    data = request.get_json()
    current_user_id = get_jwt_identity()

    if not data or not data.get('item_id') or not data.get('content'):
        return jsonify({"error": "item_id and content are required"}), 400

    comment = Comment(
        user_id=current_user_id,
        item_id=data['item_id'],
        content=data['content']
    )
    db.session.add(comment)
    db.session.commit()
    return jsonify({"message": "Comment added."}), 201

@report_bp.route('/rewards', methods=['POST'])
@jwt_required()
def offer_reward():
    data = request.get_json()
    current_user_id = get_jwt_identity()

    required = ['item_id', 'receiver_id', 'amount']
    if not all(field in data for field in required):
        return jsonify({"error": "item_id, receiver_id, and amount are required"}), 400

    reward = Reward(
        item_id=data['item_id'],
        sender_id=current_user_id,
        receiver_id=data['receiver_id'],
        amount=data['amount'],
        paid=data.get('paid', False)
    )
    db.session.add(reward)
    db.session.commit()
    return jsonify({"message": "Reward offered."}), 201

@report_bp.route('/rewards', methods=['GET'])
@jwt_required()
def get_user_rewards():
    current_user_id = get_jwt_identity()
    sent = Reward.query.filter_by(sender_id=current_user_id).all()
    received = Reward.query.filter_by(receiver_id=current_user_id).all()

    return jsonify({
        "sent": [{"item_id": r.item_id, "amount": r.amount, "paid": r.paid} for r in sent],
        "received": [{"item_id": r.item_id, "amount": r.amount, "paid": r.paid} for r in received]
    }), 200
