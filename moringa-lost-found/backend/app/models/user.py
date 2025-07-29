from datetime import datetime
from app.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), default='user')  # 'user' or 'admin'
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())

    # Relationships
    reported_items = db.relationship('Item', backref='reporter', lazy=True, foreign_keys='Item.reported_by')
    reports = db.relationship('Report', back_populates='user', lazy=True)
    claims = db.relationship('Claim', backref='claimant', lazy=True, foreign_keys='Claim.claimant_id')
    comments = db.relationship('Comment', backref='author', lazy=True)
    rewards_as_finder = db.relationship('Reward', backref='finder', lazy=True, foreign_keys='Reward.finder_user_id')
    rewards_as_owner = db.relationship('Reward', backref='owner', lazy=True, foreign_keys='Reward.owner_user_id')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>'
