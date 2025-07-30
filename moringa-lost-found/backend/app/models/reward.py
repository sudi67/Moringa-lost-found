from datetime import datetime
from app.extensions import db

class Reward(db.Model):
    __tablename__ = 'rewards'
    
    id = db.Column(db.Integer, primary_key=True)
    report_id = db.Column(db.Integer, db.ForeignKey('reports.id'), nullable=True)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    finder_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    owner_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    mpesa_transaction_id = db.Column(db.String(100), unique=True, nullable=True)
    mpesa_phone_number = db.Column(db.String(20), nullable=True)
    status = db.Column(db.String(20), default='pending')  # pending, completed, failed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    item = db.relationship('Item', overlaps="rewards")
    # User relationships are defined in User model
