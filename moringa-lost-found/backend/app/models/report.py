from datetime import datetime
from app.extensions import db

class Report(db.Model):
    __tablename__ = 'reports'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    reward_amount = db.Column(db.Float, nullable=True)
    reward_status = db.Column(db.String(20), nullable=True)
    mpesa_phone_number = db.Column(db.String(20), nullable=True)
    mpesa_transaction_id = db.Column(db.String(100), unique=True, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())

    # user relationship is defined in User model
    item = db.relationship('Item', backref='reports')
    rewards = db.relationship('Reward', backref='report', lazy=True)

    def __repr__(self):
        return f'<Report {self.id} by User {self.user_id} for Item {self.item_id}>'

class Claim(db.Model):
    __tablename__ = 'claims'

    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    claimant_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())

    item = db.relationship('Item', overlaps="claims")
    # claimant relationship is defined in User model

    def __repr__(self):
        return f'<Claim {self.id} by User {self.claimant_id} for Item {self.item_id}>'

class Comment(db.Model):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    comment_text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())

    item = db.relationship('Item', overlaps="comments")
    author = db.relationship('User')

    def __repr__(self):
        return f'<Comment {self.id} by User {self.author_id} for Item {self.item_id}>'


