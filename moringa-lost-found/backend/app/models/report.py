from datetime import datetime
from app.extensions import db

# === Report Model ===
class Report(db.Model):
    __tablename__ = 'reports'

    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    is_approved = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())
    
    # New fields for reward integration
    reward_amount = db.Column(db.Float, nullable=True)
    reward_status = db.Column(db.String(20), default='none')  # none, offered, pending, completed, failed
    mpesa_phone_number = db.Column(db.String(20), nullable=True)
    mpesa_transaction_id = db.Column(db.String(100), unique=True, nullable=True)
    
    # Relationships
    item = db.relationship('Item', backref='reports', lazy=True)
    user = db.relationship('User', back_populates='reports')
    
    # Relationship to reward
    reward = db.relationship('Reward', backref='report', uselist=False, lazy=True)

    def __repr__(self):
        return f'<Report Item {self.item_id} by User {self.user_id}>'

# === Claim Model ===
class Claim(db.Model):
    __tablename__ = 'claims'

    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    claimant_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.String(20), default='pending')  # 'pending', 'approved', 'rejected'
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())

    def __repr__(self):
        return f'<Claim by User {self.claimant_id} on Item {self.item_id} - {self.status}>'

# === Comment Model ===
class Comment(db.Model):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    comment_text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())

    def __repr__(self):
        return f'<Comment by User {self.author_id} on Item {self.item_id}>'

# === Reward Model ===
class Reward(db.Model):
    __tablename__ = 'rewards'

    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    report_id = db.Column(db.Integer, db.ForeignKey('reports.id'), nullable=True)  # Link to report
    finder_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    owner_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    mpesa_transaction_id = db.Column(db.String(100), unique=True, nullable=True)
    mpesa_phone_number = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, completed, failed
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())
    updated_at = db.Column(db.DateTime, default=lambda: datetime.utcnow(), onupdate=lambda: datetime.utcnow())
    
    # Relationships
    item = db.relationship('Item', backref='rewards')
    report = db.relationship('Report', backref='reward_link')
    finder = db.relationship('User', foreign_keys=[finder_user_id], backref='rewards_received')
    owner = db.relationship('User', foreign_keys=[owner_user_id], backref='rewards_given')

    def __repr__(self):
        return f'<Reward {self.amount} for Item {self.item_id} - {self.status}>'
