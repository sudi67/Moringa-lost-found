from flask import request, jsonify
from app.models.report import Claim, Comment, Reward
from app.models import db

def create_claim():
    data = request.get_json()
    claim = Claim(
        item_id=data['item_id'],
        user_id=data['user_id'],
        status=data.get('status', 'pending')
    )
    db.session.add(claim)
    db.session.commit()
    return jsonify({"message": "Claim submitted."}), 201

def add_comment():
    data = request.get_json()
    comment = Comment(
        user_id=data['user_id'],
        item_id=data['item_id'],
        content=data['content']
    )
    db.session.add(comment)
    db.session.commit()
    return jsonify({"message": "Comment added."}), 201

def offer_reward():
    data = request.get_json()
    reward = Reward(
        item_id=data['item_id'],
        sender_id=data['sender_id'],
        receiver_id=data['receiver_id'],
        amount=data['amount'],
        paid=data.get('paid', False)
    )
    db.session.add(reward)
    db.session.commit()
    return jsonify({"message": "Reward offered."}), 201

def get_user_rewards(user_id):
    sent = Reward.query.filter_by(sender_id=user_id).all()
    received = Reward.query.filter_by(receiver_id=user_id).all()
    return jsonify({
        "sent": [{"item_id": r.item_id, "amount": r.amount, "paid": r.paid} for r in sent],
        "received": [{"item_id": r.item_id, "amount": r.amount, "paid": r.paid} for r in received]
    }), 200
