from flask import Blueprint, request, jsonify
from services import UserService
from repositories import UserRepository
from utils.db import db_session_context

bp = Blueprint("users", __name__)


@bp.route("/", methods=["POST"])
def create_user():
    try:
        data = request.get_json()

        with db_session_context() as session:
            user_repository = UserRepository(session)
            user_service = UserService(user_repository)

            user = user_service.create_user(
                first_name=data["first_name"],
                last_name=data["last_name"],
                email=data["email"],
                role=data.get("role", "user"),
            )

            return (
                jsonify(
                    {
                        "user_uuid": str(user.user_uuid),
                        "email": user.email,
                        "message": "User created successfully",
                    }
                ),
                201,
            )

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500


@bp.route("/<user_uuid>", methods=["GET"])
def get_user(user_uuid):
    try:
        with db_session_context() as session:
            user_repository = UserRepository(session)
            user_service = UserService(user_repository)

            user = user_service.get_user(user_uuid)
            if not user:
                return jsonify({"error": "User not found"}), 404

            return jsonify(
                {
                    "user_uuid": str(user.user_uuid),
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "role": user.role,
                }
            )

    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500
