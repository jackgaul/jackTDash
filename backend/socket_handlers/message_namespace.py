from flask_socketio import Namespace, emit, join_room
from services import MessageService, UserService
from repositories import MessageRepository, TicketRepository, UserRepository
from utils.db import db_session_context
from models import Message
from LLMAgent import llm_plan_agent


class MessageNamespace(Namespace):
    def on_connect(self):
        print("Client connected to the messages namespace.")

    def on_disconnect(self):
        print("Client disconnected from the messages namespace.")

    def on_join(self, data):
        """
        Expected data format: { "author_name": "Alice", "ticket_tag": "general" }
        """
        author_name = data.get("author_name")
        ticket_tag = data.get("ticket_tag")
        join_room(ticket_tag)
        # Emit a system message to everyone in the room.
        emit(
            "system_message",
            {"message": f"{author_name} has joined room {ticket_tag}."},
            room=ticket_tag,
        )
        print(f"{author_name} joined room {ticket_tag}.")

    def on_send_message(self, data):
        """
        Expected data format:
        {
        "author_uuid": "Alice",
        "ticket_uuid": "SLACK-1",
        "message": "Hello everyone!",
        "author_name": "Alice Acher",
        "author_role": "admin",
        "is_internal": False
        }
        """
        ticket_tag = data.get("ticket_tag")

        with db_session_context() as session:
            message_repository = MessageRepository(session)
            ticket_repository = TicketRepository(session)
            message_service = MessageService(message_repository, ticket_repository)

            message = message_service.add_message(
                author_uuid=data["author_uuid"],
                ticket_uuid=data["ticket_uuid"],
                message=data["message"],
                author_name=data["author_name"],
                author_role=data["author_role"],
                is_internal=data["is_internal"],
            )
            message_dict = {
                "message_uuid": str(message.message_uuid),
                "ticket_uuid": str(message.ticket_uuid),
                "created_at": message.created_at.isoformat(),
                "author_uuid": str(message.author_uuid),
                "author_name": message.author_name,
                "author_role": message.author_role,
                "is_internal": message.is_internal,
                "message": message.message,
            }

        # Broadcast the message to all clients in the room.
        emit("new_message", message_dict, room=ticket_tag)
        print(
            f"Message from {message_dict.get('author_name')} in room {ticket_tag}: {message_dict.get('message')}"
        )
        self.process_ai_message(message_dict, ticket_tag)

    def process_ai_message(self, user_message: dict, ticket_tag: str):
        """
        Expected data format: Message
        {
        message_uuid: str,
        ticket_uuid: str,
        created_at: datetime,
        author_uuid: str,
        author_name: str,
        author_role: str,
        is_internal: bool,
        message: str
        }
        """

        # Get response from LLM
        response = llm_plan_agent(user_message.get("message"))
        if (
            response.get("type") != "message"
            or response.get("response") == "Error: No response from agent"
        ):
            return

        agent_response = response.get("response")

        with db_session_context() as session:
            message_repository = MessageRepository(session)
            ticket_repository = TicketRepository(session)
            message_service = MessageService(message_repository, ticket_repository)
            user_repository = UserRepository(session)
            user_service = UserService(user_repository)
            # Get Agent Info from database
            agent_info = user_service.get_agent_user("JackT", "Agent")

            # Add the response to the database
            agent_message = message_service.add_message(
                author_uuid=agent_info.user_uuid,
                ticket_uuid=user_message.get("ticket_uuid"),
                message=agent_response,
                author_name=agent_info.first_name + " " + agent_info.last_name,
                author_role=agent_info.role,
                is_internal=False,
            )

            message_dict = {
                "message_uuid": str(agent_message.message_uuid),
                "ticket_uuid": str(agent_message.ticket_uuid),
                "created_at": agent_message.created_at.isoformat(),
                "author_uuid": str(agent_message.author_uuid),
                "author_name": agent_message.author_name,
                "author_role": agent_message.author_role,
                "is_internal": agent_message.is_internal,
                "message": agent_message.message,
            }

        emit("new_message", message_dict, room=ticket_tag)

        print(
            f"Message from {message_dict.get('author_name')} in room {ticket_tag}: {message_dict.get('message')}"
        )
