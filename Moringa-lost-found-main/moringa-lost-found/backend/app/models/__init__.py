
from app.extensions import db  # ✅ Use shared instance

# Import all models so they are registered
from .user import User
from .item import Item
from .report import Report, Claim, Comment, Reward
