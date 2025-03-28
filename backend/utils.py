import uuid
import random


def get_next_it_owner_id():
    # Eventually fill in the logic to get the next available it_owner_id but just return 1 for now
    return "d49ffc68-d843-40d6-8154-9bc07a2538bf"


def generate_ticket_uuid():
    # Generate a unique ticket_id
    return str(uuid.uuid4())


def generate_ticket_tag():
    return "TICKET-" + str(random.randint(1000, 9999))


def generate_message_uuid():
    return str(uuid.uuid4())
