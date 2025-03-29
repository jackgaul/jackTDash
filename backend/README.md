# Ticket Management System API

A Flask API for managing IT tickets with PostgreSQL database integration.

## Prerequisites

- Python 3.x
- PostgreSQL
- pip (Python package manager)

## Setup

1. **Configure Environment Variables**
   Create a `.env` file with:
   ```
   POSTGRES_HOST=localhost
   POSTGRES_USER=your_username
   POSTGRES_PASSWORD=your_password
   POSTGRES_DB=your_database
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Setup Database**
   ```bash
   python db_setup/reset_db.py
   ```

4. **Run the Application**
   ```bash
   python app.py
   ```
   Server starts on `http://localhost:5000`

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    user_uuid UUID PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL
);
```

### Tickets Table
```sql
CREATE TABLE tickets (
    ticket_uuid UUID PRIMARY KEY,
    ticket_tag VARCHAR(255) NOT NULL UNIQUE,
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
    it_owner_uuid UUID
);
```

### Chats Table
```sql
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
```
