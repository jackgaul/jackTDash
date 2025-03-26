# Ticket Management System API

A simple Flask API for managing IT tickets with MySQL database integration.

## Prerequisites

- Python 3.x
- MySQL Server
- pip (Python package manager)

## Setup Instructions

1. **Create a MySQL Database**
   ```sql
   CREATE DATABASE tickets_db;
   ```

2. **Configure Environment Variables**
   - Copy the `.env` file and update the values according to your MySQL configuration:
     ```
     DB_HOST=localhost
     DB_USER=your_username
     DB_PASSWORD=your_password
     DB_NAME=tickets_db
     ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Application**
   ```bash
   python app.py
   ```
   The server will start on `http://localhost:5000`

## API Endpoints

### Create a New Ticket
- **POST** `/tickets`
- Request body example:
  ```json
  {
    "name": "Server Issue",
    "description": "Production server is down",
    "raw_text": "Detailed description of the issue...",
    "severity": 1,
    "requesting_user_id": 123,
    "it_owner_id": 456
  }
  ```

### Get All Tickets
- **GET** `/tickets`

### Get Tickets by IT Owner
- **GET** `/tickets/it/<it_owner_id>`

## Database Schema

The `tickets` table contains the following fields:
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `name` (VARCHAR(255))
- `description` (VARCHAR(255))
- `raw_text` (TEXT)
- `severity` (INT)
- `requesting_user_id` (INT)
- `it_owner_id` (INT) 