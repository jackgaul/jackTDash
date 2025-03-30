from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import desc
from models import Ticket


class TicketRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_uuid(self, ticket_uuid: str) -> Optional[Ticket]:
        return (
            self.session.query(Ticket).filter(Ticket.ticket_uuid == ticket_uuid).first()
        )

    def get_all(self) -> List[Ticket]:  # get all tickets that are not deleted
        return self.session.query(Ticket).filter(Ticket.deleted == False).all()

    def get_by_it_owner_uuid(
        self, it_owner_uuid: str
    ) -> List[
        Ticket
    ]:  # get all tickets that are not deleted and are assigned to the it_owner
        return (
            self.session.query(Ticket)
            .filter(Ticket.it_owner_uuid == it_owner_uuid)
            .filter(Ticket.deleted == False)
            .all()
        )

    def create(
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
        ticket = Ticket(
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
        self.session.add(ticket)
        self.session.commit()
        return ticket

    def update(self, ticket: Ticket, **kwargs) -> Ticket:
        for key, value in kwargs.items():
            if hasattr(ticket, key):
                setattr(ticket, key, value)
        self.session.commit()
        return ticket

    def delete(self, ticket: Ticket) -> None:
        ticket.deleted = True
        self.session.commit()
