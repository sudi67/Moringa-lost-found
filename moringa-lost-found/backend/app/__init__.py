from flask import Flask
from app.extensions import db, jwt

def create_app(testing=False):
    app = Flask(__name__)

    # Load default config
    app.config.from_object('config.Config')

    # Apply testing config if testing=True
    if testing:
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        app.config['JWT_SECRET_KEY'] = 'test-secret-key'

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)

    # DO NOT register blueprints or routes here
    return app
