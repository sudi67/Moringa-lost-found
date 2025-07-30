from datetime import datetime
from app.extensions import db

class Report(db.Model):
    __tablename__ = 'reports'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())

    user = db.relationship('User', backref='reports')
    item = db.relationship('Item', backref='reports')

    def __repr__(self):
        return f'<Report {self.id} by User {self.user_id} for Item {self.item_id}>'

class Claim(db.Model):
    __tablename__ = 'claims'

    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    claimant_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())

    item = db.relationship('Item', backref='claims')
    claimant = db.relationship('User', backref='claims', overlaps="claims,claimant")

    def __repr__(self):
        return f'<Claim {self.id} by User {self.claimant_id} for Item {self.item_id}>'

class Comment(db.Model):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    comment_text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())

    item = db.relationship('Item', backref='comments')
    author = db.relationship('User', backref='comments')

    def __repr__(self):
        return f'<Comment {self.id} by User {self.author_id} for Item {self.item_id}>'

class Reward(db.Model):
    __tablename__ = 'rewards'

    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    owner_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    finder_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())

    item = db.relationship('Item', backref='rewards')
    owner = db.relationship('User', foreign_keys=[owner_user_id], backref='rewards_as_owner')
    finder = db.relationship('User', foreign_keys=[finder_user_id], backref='rewards_as_finder')

    def __repr__(self):
        return f'<Reward {self.amount} for Item {self.item_id} - {self.status}>'
