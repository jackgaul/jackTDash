import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, ForeignKey, Boolean, DateTime, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    user_uuid = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    role = Column(String(255), nullable=False)

    # Relationships
    assigned_tickets = relationship(
        "Ticket", foreign_keys="Ticket.it_owner_uuid", back_populates="it_owner"
    )
    requested_tickets = relationship(
        "Ticket",
        foreign_keys="Ticket.requesting_user_uuid",
        back_populates="requesting_user",
    )
    messages = relationship("Message", back_populates="author")

    def __repr__(self):
        return f"<User(user_uuid='{self.user_uuid}', first_name='{self.first_name}', last_name='{self.last_name}', email='{self.email}')>"


class Ticket(Base):
    __tablename__ = "tickets"

    ticket_uuid = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ticket_tag = Column(String(255), nullable=False, unique=True)
    title = Column(String(255), nullable=False)
    status = Column(String(255), nullable=False)
    priority = Column(String(255), nullable=False)
    category = Column(String(255), nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(
        DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )
    description = Column(String(255))
    raw_text = Column(Text)
    department = Column(String(255))

    # Foreign keys
    requesting_user_uuid = Column(UUID(as_uuid=True), ForeignKey("users.user_uuid"))
    it_owner_uuid = Column(UUID(as_uuid=True), ForeignKey("users.user_uuid"))
    deleted = Column(Boolean, default=False)

    # Relationships
    requesting_user = relationship(
        "User", foreign_keys=[requesting_user_uuid], back_populates="requested_tickets"
    )
    it_owner = relationship(
        "User", foreign_keys=[it_owner_uuid], back_populates="assigned_tickets"
    )
    messages = relationship("Message", back_populates="ticket")

    # Generate a ticket tag based on category
    @classmethod
    def generate_ticket_tag(cls, session, tag_name):
        """Generate a ticket tag based on category"""
        # Ensure category exists and get its info
        tag = TicketTag.ensure_tag(session, tag_name)

        # Get next sequence value
        result = session.execute(text(f"SELECT nextval('{tag.sequence_name}')"))
        seq_num = result.scalar()

        # Return formatted tag
        return f"{tag.tag_name}-{seq_num}"

    def __repr__(self):
        return f"<Ticket(ticket_uuid='{self.ticket_uuid}', ticket_tag='{self.ticket_tag}', title='{self.title}', status='{self.status}', priority='{self.priority}', category='{self.category}', created_at='{self.created_at}', updated_at='{self.updated_at}', description='{self.description}', raw_text='{self.raw_text}', department='{self.department}', requesting_user_uuid='{self.requesting_user_uuid}', it_owner_uuid='{self.it_owner_uuid}')>"


class Message(Base):
    __tablename__ = "messages"

    message_uuid = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ticket_uuid = Column(
        UUID(as_uuid=True), ForeignKey("tickets.ticket_uuid"), nullable=False
    )
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    author_uuid = Column(
        UUID(as_uuid=True), ForeignKey("users.user_uuid"), nullable=False
    )
    message = Column(Text)
    author_name = Column(String(255))
    author_role = Column(String(255))
    is_internal = Column(Boolean, default=False)

    # Relationships
    ticket = relationship("Ticket", back_populates="messages")
    author = relationship("User", back_populates="messages")

    def __repr__(self):
        return f"<Message(message_uuid='{self.message_uuid}', ticket_uuid='{self.ticket_uuid}', created_at='{self.created_at}', author_uuid='{self.author_uuid}', message='{self.message}', author_name='{self.author_name}', author_role='{self.author_role}', is_internal='{self.is_internal}')>"


class TicketTag(Base):
    __tablename__ = "ticket_tags"

    tag_uuid = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tag_name = Column(String(50), unique=True, nullable=False)
    sequence_name = Column(String(100), unique=True, nullable=False)

    @classmethod
    def ensure_tag(cls, session, tag_name):
        """Ensure the tag exists and has a sequence"""
        tag_name = tag_name.upper()

        # Look for existing tag
        tag = session.query(cls).filter_by(tag_name=tag_name).first()

        if not tag:
            # Create a new sanitized sequence name
            import re

            if not re.match(r"^[A-Z0-9_]+$", tag_name):
                raise ValueError(
                    "Tag must contain only uppercase letters, numbers, and underscores"
                )

            sequence_name = f"{tag_name}_seq"

            # Create the sequence in PostgreSQL
            session.execute(text(f"CREATE SEQUENCE {sequence_name} START 1"))

            # Create and store the tag mapping
            tag = cls(tag_name=tag_name, sequence_name=sequence_name)
            session.add(tag)
            session.flush()

        return tag

    def __repr__(self):
        return f"<TicketTag(tag_uuid='{self.tag_uuid}', tag_name='{self.tag_name}', sequence_name='{self.sequence_name}')>"
