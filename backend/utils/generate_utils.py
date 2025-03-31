import uuid


def get_next_it_owner_id():
    # Eventually fill in the logic to get the next available it_owner_id but just return 1 for now
    # This is the UUID of the IT owner user in the reset_db.py file
    return "b87ab50f-e199-42a1-a257-cc4216e896c0"


def generate_ticket_uuid():
    # Generate a unique ticket_id
    return str(uuid.uuid4())


def generate_message_uuid():
    return str(uuid.uuid4())
