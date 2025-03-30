#!/usr/bin/env python3
import os
import uuid
from datetime import datetime
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Import our models
from models import Base, User, Ticket, Message

# Load environment variables
current_dir = os.path.dirname(__file__)
parent_dir = os.path.join(current_dir, "..", ".env")
load_dotenv(dotenv_path=parent_dir)

# Read database connection info from environment
try:
    POSTGRES_HOST = os.getenv("POSTGRES_HOST")
    POSTGRES_USER = os.getenv("POSTGRES_USER")
    POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
    POSTGRES_DB = os.getenv("POSTGRES_DB")
except Exception as e:
    print(f"Error loading environment variables: {e}")
    exit(1)


def create_database_if_not_exists(dbname, user, password, host="127.0.0.1"):
    """
    Connect to the 'postgres' database and create `dbname` if it does not already exist.
    """
    # Connect to the default 'postgres' database
    engine = create_engine(f"postgresql://{user}:{password}@{host}/postgres")
    with engine.connect() as conn:
        conn.execution_options(isolation_level="AUTOCOMMIT")
        # Check if the database already exists
        result = conn.execute(
            text("SELECT 1 FROM pg_database WHERE datname = :dbname"),
            {"dbname": dbname},
        )
        exists = result.fetchone()

        if not exists:
            print(f"Database '{dbname}' does not exist. Creating...")
            conn.execute(text(f"CREATE DATABASE {dbname}"))
        else:
            print(f"Database '{dbname}' already exists. Skipping creation.")


def main():
    # Create the database if it doesn't exist
    create_database_if_not_exists(
        POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST
    )

    # Create SQLAlchemy engine and connect to the database
    engine = create_engine(
        f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}/{POSTGRES_DB}"
    )

    # Drop all tables
    Base.metadata.drop_all(engine)

    # Create all tables
    Base.metadata.create_all(engine)

    # Create a session
    Session = sessionmaker(bind=engine)
    session = Session()

    # Define UUIDs for reference
    it_owner_user_id = uuid.UUID("b87ab50f-e199-42a1-a257-cc4216e896c0")
    john_user_id = uuid.uuid4()
    JackT_user_id = uuid.uuid4()
    user_ids = [uuid.uuid4() for _ in range(3)]
    first_ticket_uuid = uuid.UUID("e0ff03cb-8e8b-42fb-9f92-e7fe98f80722")

    # Create users
    users = [
        User(
            user_uuid=john_user_id,
            first_name="John",
            last_name="Doe",
            email="john.doe@example.com",
            role="Marketing Manager",
        ),
        User(
            user_uuid=it_owner_user_id,
            first_name="Jack",
            last_name="Gaul",
            email="jack@example.com",
            role="IT Manager",
        ),
        User(
            user_uuid=JackT_user_id,
            first_name="JackT",
            last_name="Agent",
            email="jackt@example.com",
            role="CoPilot",
        ),
        User(
            user_uuid=user_ids[0],
            first_name="Jess",
            last_name="Hanson",
            email="jess@example.com",
            role="Marketing Manager",
        ),
        User(
            user_uuid=user_ids[1],
            first_name="James",
            last_name="Jacob",
            email="james@example.com",
            role="Sales Manager",
        ),
        User(
            user_uuid=user_ids[2],
            first_name="Max",
            last_name="Bauer",
            email="max@example.com",
            role="Engineering Manager",
        ),
    ]
    session.add_all(users)
    session.flush()  # Flush to get the IDs

    # Create tickets
    tickets = [
        Ticket(
            ticket_uuid=first_ticket_uuid,
            ticket_tag="TICKET-1001",
            title="Slack Channel Creation",
            status="open",
            priority="high",
            category="Slack",
            created_at=datetime.fromisoformat("2023-04-11 03:15:00"),
            updated_at=datetime.fromisoformat("2023-04-11 07:30:00"),
            description="Create a new Slack channel for the marketing department named #marketing-alerts and invite all members of the marketing department to the channel.",
            raw_text="Create a new Slack channel for the marketing department named #marketing-alerts and invite all members of the marketing department to the channel.",
            requesting_user_uuid=john_user_id,
            department="Marketing",
            it_owner_uuid=it_owner_user_id,
        ),
        Ticket(
            ticket_uuid=uuid.uuid4(),
            ticket_tag="TICKET-1002",
            title="Windows update deployment issue",
            status="open",
            priority="high",
            category="Slack",
            created_at=datetime.fromisoformat("2023-04-11 08:00:00"),
            updated_at=datetime.fromisoformat("2023-04-11 09:45:00"),
            description="Critical Windows updates failing to deploy to marketing department machines",
            raw_text="SCCM reporting 23 workstations in Marketing department failed to receive latest "
            "security patches. Error code 0x80070002 appearing in logs. Potential security risk.",
            requesting_user_uuid=user_ids[0],
            department="Marketing",
            it_owner_uuid=it_owner_user_id,
        ),
        Ticket(
            ticket_uuid=uuid.uuid4(),
            ticket_tag="TICKET-1003",
            title="Network switch malfunction",
            status="open",
            priority="high",
            category="Network",
            created_at=datetime.fromisoformat("2023-04-11 07:15:00"),
            updated_at=datetime.fromisoformat("2023-04-11 08:00:00"),
            description="Core switch on 3rd floor showing intermittent failures",
            raw_text="Switch SW-3F-CORE-01 reporting multiple interface errors. Affecting approximately "
            "50 users on floor 3. Redundant path active but operating at reduced capacity.",
            requesting_user_uuid=user_ids[1],
            department="IT",
            it_owner_uuid=it_owner_user_id,
        ),
        Ticket(
            ticket_uuid=uuid.uuid4(),
            ticket_tag="TICKET-1004",
            title="Email service not working",
            status="open",
            priority="high",
            category="Email",
            created_at=datetime.fromisoformat("2023-04-10 09:00:00"),
            updated_at=datetime.fromisoformat("2023-04-10 14:30:00"),
            description="Users are unable to send or receive emails since this morning.",
            raw_text="Multiple users reported inability to send or receive emails. System-wide email "
            "outage affecting all departments. Requires immediate attention.",
            requesting_user_uuid=user_ids[2],
            department="Marketing",
            it_owner_uuid=it_owner_user_id,
        ),
        Ticket(
            ticket_uuid=uuid.uuid4(),
            ticket_tag="TICKET-1005",
            title="VPN connection issues",
            status="in-progress",
            priority="medium",
            category="Network",
            created_at=datetime.fromisoformat("2023-04-09 11:20:00"),
            updated_at=datetime.fromisoformat("2023-04-10 10:15:00"),
            description="Remote workers are experiencing intermittent VPN disconnections.",
            raw_text="Remote team members reporting frequent VPN drops. Issue appears to be affecting "
            "multiple geographic locations. Connection stability varies throughout the day.",
            requesting_user_uuid=user_ids[0],
            department="IT",
            it_owner_uuid=it_owner_user_id,
        ),
        Ticket(
            ticket_uuid=uuid.uuid4(),
            ticket_tag="TICKET-1006",
            title="New software installation request",
            status="pending",
            priority="low",
            category="Software",
            created_at=datetime.fromisoformat("2023-04-08 15:45:00"),
            updated_at=datetime.fromisoformat("2023-04-09 09:30:00"),
            description="Marketing department requesting Adobe Creative Suite installation on 5 workstations.",
            raw_text="Marketing team needs full Adobe Creative Suite installed. Licenses already purchased. "
            "Workstations identified: MKT-001 through MKT-005.",
            requesting_user_uuid=user_ids[1],
            department="Marketing",
            it_owner_uuid=it_owner_user_id,
        ),
    ]
    session.add_all(tickets)
    session.flush()

    # Create messages
    messages = [
        Message(
            message_uuid=uuid.uuid4(),
            ticket_uuid=first_ticket_uuid,
            created_at=datetime.fromisoformat("2023-04-11 03:15:00"),
            author_uuid=john_user_id,
            message="Hey can you create a new Slack channel for the marketing department named #marketing-alerts and invite all members of the marketing department to the channel?",
            author_name="John Doe",
            author_role="Marketing Manager",
            is_internal=False,
        ),
        Message(
            message_uuid=uuid.uuid4(),
            ticket_uuid=first_ticket_uuid,
            created_at=datetime.fromisoformat("2023-04-11 03:15:10"),
            author_uuid=it_owner_user_id,
            message="Hey JackT, Create a new Slack channel for the marketing department named #marketing-alerts and invite all members of the marketing department to the channel.",
            author_name="Jack",
            author_role="IT Manager",
            is_internal=True,
        ),
        Message(
            message_uuid=uuid.uuid4(),
            ticket_uuid=first_ticket_uuid,
            created_at=datetime.fromisoformat("2023-04-11 03:15:15"),
            author_uuid=JackT_user_id,
            message="Sure, I can do that. I'll create the channel and invite the members.",
            author_name="JackT",
            author_role="CoPilot",
            is_internal=True,
        ),
        Message(
            message_uuid=uuid.uuid4(),
            ticket_uuid=first_ticket_uuid,
            created_at=datetime.fromisoformat("2023-04-11 03:15:20"),
            author_uuid=JackT_user_id,
            message="I've created the channel and invited the members. Ill let John know.",
            author_name="JackT",
            author_role="CoPilot",
            is_internal=True,
        ),
        Message(
            message_uuid=uuid.uuid4(),
            ticket_uuid=first_ticket_uuid,
            created_at=datetime.fromisoformat("2023-04-11 03:15:25"),
            author_uuid=JackT_user_id,
            message="Hey John, I've created the channel and invited the members.",
            author_name="JackT",
            author_role="CoPilot",
            is_internal=False,
        ),
        Message(
            message_uuid=uuid.uuid4(),
            ticket_uuid=first_ticket_uuid,
            created_at=datetime.fromisoformat("2023-04-11 03:15:30"),
            author_uuid=john_user_id,
            message="Hey JackT, thanks for the help.",
            author_name="John Doe",
            author_role="Marketing Manager",
            is_internal=False,
        ),
    ]
    session.add_all(messages)

    # Commit all changes
    session.commit()
    session.close()

    print("Successfully reset database and inserted sample data using SQLAlchemy.")


if __name__ == "__main__":
    main()
