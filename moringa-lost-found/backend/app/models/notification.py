from datetime import datetime
from app.extensions import db

class Notification(db.Model):
    __tablename__ = 'notifications'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(50), default='info')  # 'info', 'success', 'warning', 'error'
    is_read = db.Column(db.Boolean, default=False)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=True)  # Optional reference to related item
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())

    # Relationships
    user = db.relationship('User', backref='notifications', lazy=True)
    item = db.relationship('Item', backref='notifications', lazy=True)

    def __repr__(self):
        return f'<Notification {self.title} for User {self.user_id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'message': self.message,
            'type': self.type,
            'is_read': self.is_read,
            'item_id': self.item_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }