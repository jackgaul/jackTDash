from typing import Optional
from repositories import UserRepository
from models import User


class UserService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def get_user(self, user_uuid: str) -> Optional[User]:
        return self.user_repository.get_by_uuid(user_uuid)

    def get_agent_user(
        self, agent_first_name: str, agent_last_name: str
    ) -> Optional[User]:
        return self.user_repository.get_agent_user(agent_first_name, agent_last_name)
