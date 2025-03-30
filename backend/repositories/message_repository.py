from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import desc
from models import Message


class MessageRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_uuid(self, message_uuid: str) -> Optional[Message]:
        return (
            self.session.query(Message)
            .filter(Message.message_uuid == message_uuid)
            .first()
        )

    def get_all(self) -> List[Message]:
        return self.session.query(Message).all()

    def create(
        self,
        author_uuid: str,
        message: str,
        ticket_uuid: str,
        author_name: str,
        author_role: str,
        is_internal: bool,
    ) -> Message:
        message = Message(
            author_uuid=author_uuid,
            ticket_uuid=ticket_uuid,
            message=message,
            author_name=author_name,
            author_role=author_role,
            is_internal=is_internal,
        )
        self.session.add(message)
        self.session.commit()
        return message

    def get_message_history(self, ticket_uuid: str) -> List[Message]:
        return (
            self.session.query(Message)
            .filter(Message.ticket_uuid == ticket_uuid)
            .order_by(Message.created_at)
            .all()
        )

    def update(self, message: Message, **kwargs) -> Message:
        for key, value in kwargs.items():
            if hasattr(message, key):
                setattr(message, key, value)
        self.session.commit()
        return message

    def delete(self, message: Message) -> None:
        self.session.delete(message)
        self.session.commit()
