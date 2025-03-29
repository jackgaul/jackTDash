#!/usr/bin/env python3
import os
import psycopg2
import psycopg2.extras
from dotenv import load_dotenv
import uuid
import random

current_dir = os.path.dirname(__file__)
parent_dir = os.path.join(current_dir, "..", ".env")
# sys.path.append(parent_dir)

# Load environment variables from .env file
load_dotenv(dotenv_path=parent_dir)

# Read variables from environment or fall back to defaults
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
    conn = psycopg2.connect(dbname="postgres", user=user, password=password, host=host)
    conn.set_session(autocommit=True)
    cur = conn.cursor()

    # Check if the database already exists
    cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (dbname,))
    exists = cur.fetchone()

    if not exists:
        print(f"Database '{dbname}' does not exist. Creating...")
        cur.execute(f"CREATE DATABASE {dbname}")
    else:
        print(f"Database '{dbname}' already exists. Skipping creation.")

    cur.close()
    conn.close()


def main():
    # 1) Create the database if it doesn’t exist (optional)
    create_database_if_not_exists(
        POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST
    )

    # 2) Connect to the new database
    conn = psycopg2.connect(
        dbname=POSTGRES_DB,
        user=POSTGRES_USER,
        password=POSTGRES_PASSWORD,
        host=POSTGRES_HOST,
    )
    cur = conn.cursor()

    # 3) Drop the table if it exists
    drop_table_sql = """
    DROP TABLE IF EXISTS tickets;
    """
    cur.execute(drop_table_sql)

    # 4) Create the table with PostgreSQL-friendly syntax
    create_table_sql = """
    CREATE TABLE tickets (
        ticket_uuid UUID PRIMARY KEY,
        ticket_tag VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        status VARCHAR(255) NOT NULL,
        priority VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL,
        description VARCHAR(255),
        raw_text TEXT,
        department VARCHAR(255),
        requesting_user_uuid UUID,
        it_owner_uuid UUID,
        UNIQUE (ticket_tag)
    );
    """
    cur.execute(create_table_sql)

    my_user_id = "b87ab50f-e199-42a1-a257-cc4216e896c0"
    JackT_user_id = str(uuid.uuid4())
    john_user_id = str(uuid.uuid4())
    user_ids = [str(uuid.uuid4()) for _ in range(3)]
    first_ticket_uuid = "e0ff03cb-8e8b-42fb-9f92-e7fe98f80722"
    # 5) Prepare a list of ticket dictionaries
    tickets = [
        {
            "ticket_uuid": first_ticket_uuid,
            "ticket_tag": "TICKET-1001",
            "title": "Slack Channel Creation",
            "status": "open",
            "priority": "high",
            "category": "Slack",
            "created_at": "2023-04-11 03:15:00",
            "updated_at": "2023-04-11 07:30:00",
            "description": "Create a new Slack channel for the marketing department named #marketing-alerts and invite all members of the marketing department to the channel.",
            "raw_text": (
                "Create a new Slack channel for the marketing department named #marketing-alerts and invite all members of the marketing department to the channel."
            ),
            "requesting_user_uuid": john_user_id,
            "department": "Marketing",
            "it_owner_uuid": my_user_id,
        },
        {
            "ticket_uuid": str(uuid.uuid4()),
            "ticket_tag": "TICKET-1002",
            "title": "Windows update deployment issue",
            "status": "open",
            "priority": "high",
            "category": "Slack",
            "created_at": "2023-04-11 08:00:00",
            "updated_at": "2023-04-11 09:45:00",
            "description": "Critical Windows updates failing to deploy to marketing department machines",
            "raw_text": (
                "SCCM reporting 23 workstations in Marketing department failed to receive latest "
                "security patches. Error code 0x80070002 appearing in logs. Potential security risk."
            ),
            "requesting_user_uuid": user_ids[0],
            "department": "Marketing",
            "it_owner_uuid": my_user_id,
        },
        {
            "ticket_uuid": str(uuid.uuid4()),
            "ticket_tag": "TICKET-1003",
            "title": "Network switch malfunction",
            "status": "open",
            "priority": "high",
            "category": "Network",
            "created_at": "2023-04-11 07:15:00",
            "updated_at": "2023-04-11 08:00:00",
            "description": "Core switch on 3rd floor showing intermittent failures",
            "raw_text": (
                "Switch SW-3F-CORE-01 reporting multiple interface errors. Affecting approximately "
                "50 users on floor 3. Redundant path active but operating at reduced capacity."
            ),
            "requesting_user_uuid": user_ids[1],
            "department": "IT",
            "it_owner_uuid": my_user_id,
        },
        {
            "ticket_uuid": str(uuid.uuid4()),
            "ticket_tag": "TICKET-1004",
            "title": "Email service not working",
            "status": "open",
            "priority": "high",
            "category": "Email",
            "created_at": "2023-04-10 09:00:00",
            "updated_at": "2023-04-10 14:30:00",
            "description": "Users are unable to send or receive emails since this morning.",
            "raw_text": (
                "Multiple users reported inability to send or receive emails. System-wide email "
                "outage affecting all departments. Requires immediate attention."
            ),
            "requesting_user_uuid": user_ids[2],
            "department": "Marketing",
            "it_owner_uuid": my_user_id,
        },
        {
            "ticket_uuid": str(uuid.uuid4()),
            "ticket_tag": "TICKET-1005",
            "title": "VPN connection issues",
            "status": "in-progress",
            "priority": "medium",
            "category": "Network",
            "created_at": "2023-04-09 11:20:00",
            "updated_at": "2023-04-10 10:15:00",
            "description": "Remote workers are experiencing intermittent VPN disconnections.",
            "raw_text": (
                "Remote team members reporting frequent VPN drops. Issue appears to be affecting "
                "multiple geographic locations. Connection stability varies throughout the day."
            ),
            "requesting_user_uuid": user_ids[0],
            "department": "IT",
            "it_owner_uuid": my_user_id,
        },
        {
            "ticket_uuid": str(uuid.uuid4()),
            "ticket_tag": "TICKET-1006",
            "title": "New software installation request",
            "status": "pending",
            "priority": "low",
            "category": "Software",
            "created_at": "2023-04-08 15:45:00",
            "updated_at": "2023-04-09 09:30:00",
            "description": "Marketing department requesting Adobe Creative Suite installation on 5 workstations.",
            "raw_text": (
                "Marketing team needs full Adobe Creative Suite installed. Licenses already purchased. "
                "Workstations identified: MKT-001 through MKT-005."
            ),
            "requesting_user_uuid": user_ids[1],
            "department": "Marketing",
            "it_owner_uuid": my_user_id,
        },
    ]

    # 6) Insert tickets using a parameterized statement
    insert_data_sql = """
    INSERT INTO tickets (
        ticket_uuid, ticket_tag, title, status, priority, category,
        created_at, updated_at, description, raw_text,
        requesting_user_uuid, it_owner_uuid
    )
    VALUES (
        %(ticket_uuid)s, %(ticket_tag)s, %(title)s, %(status)s, %(priority)s, %(category)s,
        %(created_at)s, %(updated_at)s, %(description)s, %(raw_text)s,
        %(requesting_user_uuid)s, %(it_owner_uuid)s
    )
    """

    # executemany() will loop over each dict in `tickets` and perform the insert
    cur.executemany(insert_data_sql, tickets)

    drop_chat_table_sql = """
    DROP TABLE IF EXISTS chats;
    """
    cur.execute(drop_chat_table_sql)

    create_chat_table_sql = """
    CREATE TABLE chats (
        message_uuid UUID PRIMARY KEY,
        ticket_uuid UUID NOT NULL,
        created_at TIMESTAMP NOT NULL,
        author_uuid UUID,
        message TEXT,
        author_name VARCHAR(255),
        author_role VARCHAR(255),
        is_internal BOOLEAN DEFAULT FALSE
    );
    """
    cur.execute(create_chat_table_sql)

    chats = [
        {
            "message_uuid": str(uuid.uuid4()),
            "ticket_uuid": tickets[0]["ticket_uuid"],
            "created_at": "2023-04-11 03:15:00",
            "author_uuid": john_user_id,
            "message": "Hey can you create a new Slack channel for the marketing department named #marketing-alerts and invite all members of the marketing department to the channel?",
            "author_name": "John Doe",
            "author_role": "Marketing Manager",
            "is_internal": False,
        },
        {
            "message_uuid": str(uuid.uuid4()),
            "ticket_uuid": tickets[0]["ticket_uuid"],
            "created_at": "2023-04-11 03:15:10",
            "author_uuid": my_user_id,
            "message": "Hey JackT, Create a new Slack channel for the marketing department named #marketing-alerts and invite all members of the marketing department to the channel.",
            "author_name": "Jack",
            "author_role": "IT Manager",
            "is_internal": True,
        },
        {
            "message_uuid": str(uuid.uuid4()),
            "ticket_uuid": tickets[0]["ticket_uuid"],
            "created_at": "2023-04-11 03:15:15",
            "author_uuid": JackT_user_id,
            "message": "Sure, I can do that. I'll create the channel and invite the members.",
            "author_name": "JackT",
            "author_role": "CoPilot",
            "is_internal": True,
        },
        {
            "message_uuid": str(uuid.uuid4()),
            "ticket_uuid": tickets[0]["ticket_uuid"],
            "created_at": "2023-04-11 03:15:20",
            "author_uuid": JackT_user_id,
            "message": "I've created the channel and invited the members. Ill let John know.",
            "author_name": "JackT",
            "author_role": "CoPilot",
            "is_internal": True,
        },
        {
            "message_uuid": str(uuid.uuid4()),
            "ticket_uuid": tickets[0]["ticket_uuid"],
            "created_at": "2023-04-11 03:15:25",
            "author_uuid": JackT_user_id,
            "message": "Hey John, I've created the channel and invited the members.",
            "author_name": "JackT",
            "author_role": "CoPilot",
            "is_internal": False,
        },
        {
            "message_uuid": str(uuid.uuid4()),
            "ticket_uuid": tickets[0]["ticket_uuid"],
            "created_at": "2023-04-11 03:15:30",
            "author_uuid": john_user_id,
            "message": "Hey JackT, thanks for the help.",
            "author_name": "John Doe",
            "author_role": "Marketing Manager",
            "is_internal": False,
        },
    ]

    insert_chat_data_sql = """
    INSERT INTO chats (
        message_uuid, ticket_uuid, created_at, author_uuid, message, author_name, author_role, is_internal
    )
    VALUES (
        %(message_uuid)s, %(ticket_uuid)s, %(created_at)s, %(author_uuid)s, %(message)s, %(author_name)s, %(author_role)s, %(is_internal)s
    )"""
    cur.executemany(insert_chat_data_sql, chats)

    # 7) Create users table
    drop_users_table_sql = """
    DROP TABLE IF EXISTS users;
    """
    cur.execute(drop_users_table_sql)

    create_users_table_sql = """
    CREATE TABLE users (
        user_uuid UUID PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL
    );
    """
    cur.execute(create_users_table_sql)

    users = [
        {
            "user_uuid": john_user_id,
            "first_name": "John",
            "last_name": "Doe",
            "email": "john.doe@example.com",
            "role": "Marketing Manager",
        },
        {
            "user_uuid": my_user_id,
            "first_name": "Jack",
            "last_name": "Gaul",
            "email": "jack@example.com",
            "role": "IT Manager",
        },
        {
            "user_uuid": user_ids[0],
            "first_name": "Jess",
            "last_name": "Hanson",
            "email": "jess@example.com",
            "role": "Marketing Manager",
        },
        {
            "user_uuid": user_ids[1],
            "first_name": "James",
            "last_name": "Jacob",
            "email": "james@example.com",
            "role": "Sales Manager",
        },
        {
            "user_uuid": user_ids[2],
            "first_name": "Max",
            "last_name": "Bauer",
            "email": "max@example.com",
            "role": "Engineering Manager",
        },
    ]
    insert_users_data_sql = """
    INSERT INTO users (user_uuid, first_name, last_name, email, role)
    VALUES (%(user_uuid)s, %(first_name)s, %(last_name)s, %(email)s, %(role)s)
    """
    cur.executemany(insert_users_data_sql, users)

    # 7) Commit changes and close the connection
    conn.commit()
    cur.close()
    conn.close()
    print("Successfully created 'tickets' table and inserted data into PostgreSQL.")


if __name__ == "__main__":
    main()
