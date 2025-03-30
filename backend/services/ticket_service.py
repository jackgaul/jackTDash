from typing import Optional, List
from repositories import TicketRepository, MessageRepository
from models import Ticket, Message


class TicketService:
    def __init__(
        self, ticket_repository: TicketRepository, message_repository: MessageRepository
    ):
        self.ticket_repository = ticket_repository
        self.message_repository = message_repository

    def create_ticket(
        self,
        requesting_user_uuid: str,
        title: str,
        description: str,
        status: str,
        priority: str,
        category: str,
        department: str,
        it_owner_uuid: str,
        raw_text: str,
        ticket_tag: str,
    ) -> Ticket:
        # Validate inputs
        if not title or not description:
            raise ValueError("Title and description are required")

        # Create ticket
        ticket = self.ticket_repository.create(
            requesting_user_uuid=requesting_user_uuid,
            title=title,
            description=description,
            status=status,
            priority=priority,
            category=category,
            department=department,
            it_owner_uuid=it_owner_uuid,
            raw_text=raw_text,
            ticket_tag=ticket_tag,
        )

        return ticket

    def get_all_tickets(self) -> List[Ticket]:
        return self.ticket_repository.get_all()

    def get_it_owner_tickets(self, it_owner_uuid: str) -> List[Ticket]:
        return self.ticket_repository.get_by_it_owner_uuid(it_owner_uuid)

    def update_ticket(self, ticket_uuid: str, data: dict) -> Ticket:
        ticket = self.ticket_repository.get_by_uuid(ticket_uuid)
        if not ticket:
            raise ValueError("Ticket not found")

        return self.ticket_repository.update(ticket, **data)

    def delete_ticket(self, ticket_uuid: str) -> None:
        ticket = self.ticket_repository.get_by_uuid(ticket_uuid)
        if not ticket:
            raise ValueError("Ticket not found")

        self.ticket_repository.delete(ticket)
