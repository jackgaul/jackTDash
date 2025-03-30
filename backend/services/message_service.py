from typing import Optional, List
from repositories import MessageRepository, TicketRepository
from models import Message, Ticket


class MessageService:
    def __init__(
        self, message_repository: MessageRepository, ticket_repository: TicketRepository
    ):
        self.message_repository = message_repository
        self.ticket_repository = ticket_repository

    def add_message(
        self,
        author_uuid: str,
        ticket_uuid: str,
        message: str,
        author_name: str,
        author_role: str,
        is_internal: bool,
    ) -> Message:
        # Validate ticket exists and is open
        ticket = self.ticket_repository.get_by_uuid(ticket_uuid)
        if not ticket:
            raise ValueError("Ticket not found")

        if ticket.status == "closed":
            raise ValueError("Cannot add message to closed ticket")

        return self.message_repository.create(
            author_uuid=author_uuid,
            ticket_uuid=ticket_uuid,
            message=message,
            author_name=author_name,
            author_role=author_role,
            is_internal=is_internal,
        )

    def get_messages(self, ticket_uuid: str) -> List[Message]:
        return self.message_repository.get_message_history(ticket_uuid)
