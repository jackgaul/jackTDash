from typing import Optional, List
from sqlalchemy.orm import Session
from models import User


class UserRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_uuid(self, user_uuid: str) -> Optional[User]:
        return self.session.query(User).filter(User.user_uuid == user_uuid).first()

    def get_agent_user(
        self, agent_first_name: str, agent_last_name: str
    ) -> Optional[User]:
        return (
            self.session.query(User)
            .filter(
                User.first_name == agent_first_name, User.last_name == agent_last_name
            )
            .first()
        )

    def get_all(self) -> List[User]:
        return self.session.query(User).all()

    def update(self, user: User, **kwargs) -> User:
        for key, value in kwargs.items():
            if hasattr(user, key):
                setattr(user, key, value)
        self.session.commit()
        return user
