from flask import Flask
from app.extensions import db, jwt
from flask_migrate import Migrate
from app.routes.auth_routes import auth_bp
from app.routes.user_routes import user_bp
from app.routes.item_routes import item_bp
from app.routes.report_routes import report_bp
from app.routes.admin_routes import admin_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    Migrate(app, db)  # <-- Migration setup

    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(item_bp)
    app.register_blueprint(report_bp)
    app.register_blueprint(admin_bp)

    return app
