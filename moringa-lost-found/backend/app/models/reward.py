from datetime import datetime
from app.extensions import db

class Reward(db.Model):
    __tablename__ = 'rewards'
    
    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    finder_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    owner_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    mpesa_transaction_id = db.Column(db.String(100), unique=True)
    mpesa_phone_number = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, completed, failed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    item = db.relationship('Item', backref='rewards')
    finder = db.relationship('User', foreign_keys=[finder_user_id], backref='rewards_received')
    owner = db.relationship('User', foreign_keys=[owner_user_id], backref='rewards_given')
