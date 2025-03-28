from flask import Flask, request, jsonify
import psycopg2
from psycopg2 import Error
import psycopg2.extras
import os
from dotenv import load_dotenv
from utils import (
    get_next_it_owner_id,
    generate_ticket_uuid,
    generate_ticket_tag,
    generate_message_uuid,
)
from flask_cors import CORS
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)


# Database configuration
db_config = {
    "host": os.getenv("POSTGRES_HOST"),
    "user": os.getenv("POSTGRES_USER"),
    "password": os.getenv("POSTGRES_PASSWORD"),
    "database": os.getenv("POSTGRES_DB"),
}

print(db_config)


def get_db_connection():
    try:
        conn = psycopg2.connect(
            host=db_config["host"],
            user=db_config["user"],
            password=db_config["password"],
            dbname=db_config["database"],
        )
        return conn
    except Error as e:
        print(f"Error connecting to the database: {e}")
        return None


@app.route("/tickets", methods=["POST"])
def create_ticket():
    print("Creating ticket")
    try:
        data = request.json
        required_fields = [
            "title",
            "status",
            "priority",
            "category",
            "created_at",
            "updated_at",
            "description",
            "raw_text",
            "requesting_user_uuid",
        ]

        # Validate required fields
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

        insert_query = """
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

        # Set other Values
        # it_owner_uuid = get_next_it_owner_id()
        # data["it_owner_uuid"] = it_owner_uuid

        ticket_uuid = generate_ticket_uuid()
        data["ticket_uuid"] = ticket_uuid

        ticket_tag = generate_ticket_tag()
        data["ticket_tag"] = ticket_tag

        created_at = datetime.now().isoformat()
        data["created_at"] = created_at
        data["updated_at"] = created_at

        # Generate a unique ticket_id
        cursor.execute(insert_query, data)
        conn.commit()

        # Get the inserted ticket
        cursor.execute("SELECT * FROM tickets WHERE ticket_uuid = %s", (ticket_uuid,))
        col_names = [desc[0] for desc in cursor.description]
        new_ticket = cursor.fetchone()
        new_ticket_dict = dict(zip(col_names, new_ticket))
        return jsonify(new_ticket_dict), 201

    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@app.route("/tickets/<ticket_uuid>", methods=["DELETE"])
def delete_ticket(ticket_uuid):
    print(f"Deleting ticket with UUID: {ticket_uuid}")
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cursor.execute("DELETE FROM tickets WHERE ticket_uuid = %s", (ticket_uuid,))
        conn.commit()
        return jsonify({"message": "Ticket deleted successfully"}), 200
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@app.route("/tickets/<ticket_uuid>/status", methods=["PATCH"])
def update_ticket_status(ticket_uuid):
    print(f"Updating ticket status for UUID: {ticket_uuid}")
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        data = request.json
        required_fields = ["status"]
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
        cursor.execute(
            "UPDATE tickets SET status = %s WHERE ticket_uuid = %s",
            (data["status"], ticket_uuid),
        )
        conn.commit()
        return jsonify({"message": "Ticket status updated successfully"}), 200
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@app.route("/tickets/<ticket_uuid>/priority", methods=["PATCH"])
def update_ticket_priority(ticket_uuid):
    print(f"Updating ticket priority for UUID: {ticket_uuid}")
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        data = request.json
        required_fields = ["priority"]
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
        cursor.execute(
            "UPDATE tickets SET priority = %s WHERE ticket_uuid = %s",
            (data["priority"], ticket_uuid),
        )
        conn.commit()
        return jsonify({"message": "Ticket priority updated successfully"}), 200
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@app.route("/tickets", methods=["GET"])
def get_all_tickets():
    print("Getting all tickets")
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cursor.execute("SELECT * FROM tickets")
        tickets = cursor.fetchall()

        # Convert the result to a list of dictionaries
        tickets_list = [dict(row) for row in tickets]

        return jsonify(tickets_list), 200

    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@app.route("/tickets/it/<uuid:it_owner_uuid>", methods=["GET"])
def get_tickets_by_owner(it_owner_uuid):
    print(f"Getting tickets for IT owner UUID: {it_owner_uuid}")
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

        cursor.execute(
            "SELECT * FROM tickets WHERE it_owner_uuid = %s", (it_owner_uuid,)
        )
        tickets = cursor.fetchall()

        # Convert the result to a list of dictionaries
        tickets_list = [dict(row) for row in tickets]

        return jsonify(tickets_list), 200

    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@app.route("/chats/<ticket_uuid>", methods=["GET"])
def get_chats_by_ticket_uuid(ticket_uuid):
    print(f"Getting chats for ticket UUID: {ticket_uuid}")
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

        cursor.execute("SELECT * FROM chats WHERE ticket_uuid = %s", (ticket_uuid,))
        chats = cursor.fetchall()

        # Convert the result to a list of dictionaries
        chats_list = [dict(row) for row in chats]

        return jsonify(chats_list), 200

    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@app.route("/chats/<ticket_uuid>", methods=["POST"])
def create_chat(ticket_uuid):
    print(f"Creating chat for ticket UUID: {ticket_uuid}")
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

        data = request.json
        required_fields = [
            "message",
            "author_uuid",
            "author_name",
            "author_role",
            "is_internal",
        ]

        created_at = datetime.now().isoformat()
        message_uuid = generate_message_uuid()
        data["message_uuid"] = message_uuid
        data["created_at"] = created_at
        data["ticket_uuid"] = ticket_uuid
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        cursor.execute(
            "INSERT INTO chats (message_uuid, ticket_uuid, created_at, author_uuid, message, author_name, author_role, is_internal) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
            (
                data["message_uuid"],
                data["ticket_uuid"],
                data["created_at"],
                data["author_uuid"],
                data["message"],
                data["author_name"],
                data["author_role"],
                data["is_internal"],
            ),
        )
        conn.commit()

        return jsonify(data), 201

    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@app.route("/users/<user_uuid>", methods=["GET"])
def get_user_by_uuid(user_uuid):
    print(f"Getting user for UUID: {user_uuid}")
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

        cursor.execute("SELECT * FROM users WHERE user_uuid = %s", (user_uuid,))
        user = cursor.fetchone()

        # Convert the result to a dictionary
        user_dict = dict(user)

        return jsonify(user_dict), 200

    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


if __name__ == "__main__":
    app.run(debug=True)
