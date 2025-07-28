from flask import Blueprint
from app.controllers import auth_controller

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

# User routes
auth_bp.route('/signup', methods=['POST'])(auth_controller.signup)
auth_bp.route('/login', methods=['POST'])(auth_controller.login)

# Admin routes
auth_bp.route('/admin/signup', methods=['POST'])(auth_controller.admin_signup)
auth_bp.route('/admin/login', methods=['POST'])(auth_controller.admin_login)
auth_bp.route('/admin/protected', methods=['GET'])(auth_controller.protected_admin_route)
