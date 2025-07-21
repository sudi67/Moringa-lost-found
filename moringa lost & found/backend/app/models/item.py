from datetime import datetime
from . import db

class Item(db.Model):
    __tablename__ = 'items'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='lost')  # 'lost', 'found', 'claimed'
    location_found = db.Column(db.String(200))
    image_url = db.Column(db.String(200))
    reported_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    claims = db.relationship('Claim', backref='item', lazy=True)
    comments = db.relationship('Comment', backref='item', lazy=True)
    rewards = db.relationship('Reward', backref='item', lazy=True)
    history = db.relationship('ItemHistory', backref='item', lazy=True)

    def __repr__(self):
        return f'<Item {self.name} - {self.status}>'
