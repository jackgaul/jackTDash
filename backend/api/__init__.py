from flask import Blueprint
from .user_routes import bp as user_bp
from .ticket_routes import bp as ticket_bp
from .message_routes import bp as message_bp
from .llm_routes import bp as llm_bp
from flask_cors import CORS

# Create main API blueprint
api = Blueprint("api", __name__, url_prefix="/api")

# Register route blueprints
api.register_blueprint(user_bp, url_prefix="/users")
api.register_blueprint(ticket_bp, url_prefix="/tickets")
api.register_blueprint(message_bp, url_prefix="/messages")
api.register_blueprint(llm_bp, url_prefix="/llm")
CORS(api)

__all__ = ["api"]
