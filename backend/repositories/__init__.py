from .user_repository import UserRepository
from .ticket_repository import TicketRepository
from .message_repository import MessageRepository

# This allows you to import repositories like:
# from app.repositories import UserRepository, TicketRepository
__all__ = ["UserRepository", "TicketRepository", "MessageRepository"]
