import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database configuration
db_config = {
    "host": os.getenv("DB_HOST"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "database": os.getenv("DB_NAME"),
}

print("Attempting to connect with config:", db_config)

try:
    # Create connection
    conn = mysql.connector.connect(**db_config)
    print("Successfully connected to database!")

    # Create cursor
    cursor = conn.cursor()

    # Test query to count records
    cursor.execute("SELECT COUNT(*) FROM tickets")
    count = cursor.fetchone()[0]
    print(f"Number of records in tickets table: {count}")

    # Print first few records
    cursor.execute("SELECT * FROM tickets LIMIT 3")
    records = cursor.fetchall()
    print("\nFirst 3 records:")
    for record in records:
        print(record)

except Error as e:
    print(f"Error: {e}")

finally:
    if "conn" in locals() and conn.is_connected():
        cursor.close()
        conn.close()
        print("Database connection closed.")
