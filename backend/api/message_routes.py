from flask import Blueprint, request, jsonify
from services import MessageService
from repositories import MessageRepository, TicketRepository
from utils.db import db_session_context

bp = Blueprint("messages", __name__)


@bp.route("/<ticket_uuid>", methods=["GET"])
def get_messages(ticket_uuid):
    try:
        with db_session_context() as session:
            message_repository = MessageRepository(session)
            ticket_repository = TicketRepository(session)
            message_service = MessageService(message_repository, ticket_repository)

            messages = message_service.get_messages(ticket_uuid)
            message_list = [
                {
                    "message_uuid": str(message.message_uuid),
                    "ticket_uuid": str(message.ticket_uuid),
                    "message": message.message,
                    "created_at": message.created_at.isoformat(),
                    "author_uuid": str(message.author_uuid),
                    "author_name": message.author_name,
                    "author_role": message.author_role,
                    "is_internal": message.is_internal,
                }
                for message in messages
            ]
            return jsonify(message_list)

    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500


@bp.route("/<ticket_uuid>", methods=["POST"])
def create_message(ticket_uuid):
    try:
        data = request.get_json()

        with db_session_context() as session:
            message_repository = MessageRepository(session)
            ticket_repository = TicketRepository(session)
            message_service = MessageService(message_repository, ticket_repository)

            message = message_service.add_message(
                author_uuid=data["author_uuid"],
                ticket_uuid=ticket_uuid,
                message=data["message"],
                author_name=data["author_name"],
                author_role=data["author_role"],
                is_internal=data["is_internal"],
            )
            return (
                jsonify(
                    {
                        "message_uuid": str(message.message_uuid),
                        "ticket_uuid": str(message.ticket_uuid),
                        "created_at": message.created_at.isoformat(),
                        "author_uuid": str(message.author_uuid),
                        "author_name": message.author_name,
                        "author_role": message.author_role,
                        "is_internal": message.is_internal,
                        "message": message.message,
                    }
                ),
                201,
            )

    except ValueError as e:
        print(e)
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        print(e)
        return jsonify({"error": "Internal server error"}), 500
