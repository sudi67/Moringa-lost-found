from app.routes.auth_routes import auth_bp
from app.routes.item_routes import item_bp
from app.routes.report_routes import report_bp
from app.routes.user_routes import user_bp

def register_routes(app):
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(item_bp, url_prefix='/api')
    app.register_blueprint(report_bp, url_prefix='/api')
    app.register_blueprint(user_bp, url_prefix='/api')
