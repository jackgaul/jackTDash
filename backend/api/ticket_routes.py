from flask import Blueprint, request, jsonify
from services import TicketService
from repositories import TicketRepository, MessageRepository
from utils import db_session_context
from utils import get_next_it_owner_id, generate_ticket_tag

bp = Blueprint("tickets", __name__)


@bp.route("/", methods=["POST"])
def create_ticket():
    try:
        data = request.get_json()
        print(data)

        with db_session_context() as session:
            ticket_repository = TicketRepository(session)
            message_repository = MessageRepository(session)
            ticket_service = TicketService(ticket_repository, message_repository)

            ticket = ticket_service.create_ticket(
                requesting_user_uuid=data["requesting_user_uuid"],
                title=data["title"],
                description=data["description"],
                status=data["status"],
                priority=data["priority"],
                category=data["category"],
                department=data["department"],
                it_owner_uuid=get_next_it_owner_id(),
                ticket_tag=generate_ticket_tag(),
                raw_text=data["raw_text"],
            )

            return (
                jsonify(
                    {
                        "ticket_uuid": str(ticket.ticket_uuid),
                        "title": ticket.title,
                        "ticket_tag": ticket.ticket_tag,
                        "status": ticket.status,
                        "created_at": ticket.created_at.isoformat(),
                        "updated_at": ticket.updated_at.isoformat(),
                        "priority": ticket.priority,
                        "category": ticket.category,
                        "department": ticket.department,
                        "requesting_user_uuid": ticket.requesting_user_uuid,
                        "it_owner_uuid": ticket.it_owner_uuid,
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


@bp.route("/", methods=["GET"])
def get_all_tickets():
    try:
        with db_session_context() as session:
            ticket_repository = TicketRepository(session)
            message_repository = MessageRepository(session)
            ticket_service = TicketService(ticket_repository, message_repository)
            tickets = ticket_service.get_all_tickets()

            ticket_list = [
                {
                    "ticket_uuid": str(ticket.ticket_uuid),
                    "ticket_tag": ticket.ticket_tag,
                    "title": ticket.title,
                    "status": ticket.status,
                    "description": ticket.description,
                    "created_at": ticket.created_at.isoformat(),
                    "updated_at": ticket.updated_at.isoformat(),
                    "priority": ticket.priority,
                    "category": ticket.category,
                    "department": ticket.department,
                    "requesting_user_uuid": ticket.requesting_user_uuid,
                    "it_owner_uuid": ticket.it_owner_uuid,
                }
                for ticket in tickets
            ]
            return jsonify(ticket_list)
    except Exception as e:
        print(f"Error getting all tickets: {e}")
        return jsonify({"error": "Internal server error"}), 500


@bp.route("/<ticket_uuid>/status", methods=["PATCH"])
def update_ticket_status(ticket_uuid):
    try:
        data = request.get_json()

        with db_session_context() as session:
            ticket_repository = TicketRepository(session)
            message_repository = MessageRepository(session)
            ticket_service = TicketService(ticket_repository, message_repository)
            ticket_service.update_ticket(ticket_uuid, {"status": data["status"]})
            return jsonify({"message": "Ticket updated successfully"}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "Internal server error"}), 500


@bp.route("/<ticket_uuid>/priority", methods=["PATCH"])
def update_ticket_priority(ticket_uuid):
    try:
        data = request.get_json()

        with db_session_context() as session:
            ticket_repository = TicketRepository(session)
            message_repository = MessageRepository(session)
            ticket_service = TicketService(ticket_repository, message_repository)
            ticket_service.update_ticket(ticket_uuid, {"priority": data["priority"]})
            return jsonify({"message": "Ticket updated successfully"}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "Internal server error"}), 500


@bp.route("/<ticket_uuid>", methods=["DELETE"])
def delete_ticket(ticket_uuid):
    try:
        with db_session_context() as session:
            ticket_repository = TicketRepository(session)
            message_repository = MessageRepository(session)
            ticket_service = TicketService(ticket_repository, message_repository)
            ticket_service.delete_ticket(ticket_uuid)
            return jsonify({"message": "Ticket deleted successfully"}), 200
    except ValueError as e:
        print(e)
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        print(e)
        return jsonify({"error": "Internal server error"}), 500
