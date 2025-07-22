from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

# Import all models so they are registered when db.create_all() or migrations run
from .user import User
from .item import Item
from .report import Report, Claim, Comment, Reward
# Add others as needed
