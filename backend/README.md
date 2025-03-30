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
   POSTGRES_DB=jackt_db
   OPENAI_API_KEY=your_openai_key
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Setup Database**
   ```bash
   python models/reset_db.py
   ```

4. **Run the Application**
   ```bash
   python main_app.py
   ```
   Server starts on `http://localhost:5000`

## Database Schema

### User Model
```python
class User(Base):
    __tablename__ = "users"
    
    user_uuid = UUID, primary_key=True
    first_name = String(255), required
    last_name = String(255), required
    email = String(255), required
    role = String(255), required
    
    # Relationships
    assigned_tickets = relationship("Ticket", foreign_keys="Ticket.it_owner_uuid")
    requested_tickets = relationship("Ticket", foreign_keys="Ticket.requesting_user_uuid")
    messages = relationship("Message")
```

### Ticket Model
```python
class Ticket(Base):
    __tablename__ = "tickets"
    
    ticket_uuid = UUID, primary_key=True
    ticket_tag = String(255), required, unique
    title = String(255), required
    status = String(255), required
    priority = String(255), required
    category = String(255), required
    created_at = DateTime, required
    updated_at = DateTime, required
    description = String(255)
    raw_text = Text
    department = String(255)
    requesting_user_uuid = UUID, ForeignKey("users.user_uuid")
    it_owner_uuid = UUID, ForeignKey("users.user_uuid")
    deleted = Boolean, default=False
    
    # Relationships
    requesting_user = relationship("User", foreign_keys=[requesting_user_uuid])
    it_owner = relationship("User", foreign_keys=[it_owner_uuid])
    messages = relationship("Message")
```

### Message Model
```python
class Message(Base):
    __tablename__ = "messages"
    
    message_uuid = UUID, primary_key=True
    ticket_uuid = UUID, ForeignKey("tickets.ticket_uuid"), required
    created_at = DateTime, required
    author_uuid = UUID, ForeignKey("users.user_uuid")
    message = Text
    author_name = String(255)
    author_role = String(255)
    is_internal = Boolean, default=False
    
    # Relationships
    ticket = relationship("Ticket")
    author = relationship("User")
```
