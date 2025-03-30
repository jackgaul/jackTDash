# JackT Agent Project

This project consists of a Flask backend with PostgreSQL database and a Next.js frontend dashboard. The application is built using modern web technologies and follows best practices for both frontend and backend development.

## Technology Stack

### Backend
- **Framework**: Flask (Python)
- **Database**: PostgreSQL
- **Additional Libraries**:
  - Flask-CORS for handling cross-origin requests
  - python-dotenv for environment variable management
  - psycopg2 for PostgreSQL database connection
  - OpenAI integration for AI capabilities

### Frontend
- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Package Manager**: pnpm



##Views
### My Tickets
![MyTickets](./photos/Screenshot%202025-03-29%20at%2011.55.37 AM.png)

### Ticket Creation Via Chat
![Chat](./photos/Screenshot%202025-03-29%20at%2011.54.53 AM.png)

### Specific Ticket( Created From Chat)
![One Ticket](./photos/Screenshot%202025-03-29%20at%2011.57.26 AM.png)



## Prerequisites

- Python 3.8+
- Node.js 18+
- pnpm
- PostgreSQL
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd JackT_agent
```

### 2. Backend Setup

1. Create and activate a virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  
```

2. Install Python dependencies:
```bash
pip install -r backend/requirements.txt
```

3. Set up the database:
   - Create a PostgreSQL database
   - Create a `.env` file in the backend directory with the following structure:
   ```
   POSTGRES_HOST=127.0.0.1
   POSTGRES_USER=your_username
   POSTGRES_PASSWORD=your_password
   POSTGRES_DB=jackt_db
   OPENAI_API_KEY=your_openai_api_key
   ```
   - Run the database setup script to populate sample tickets:
```bash
python backend/models/reset_db.py
```

4. Start the Flask backend:
```bash
cd backend
python main_app.py
```

The backend will run on `http://localhost:5000` by default.

### 3. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd dashboard_frontend
```

2. Install dependencies using pnpm:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

The frontend will run on `http://localhost:3000` by default.

## Development

- Backend API endpoints are available at `http://localhost:5000/`
- Frontend development server runs at `http://localhost:3000`


## Project Structure

```
JackT_agent/
├── backend/
│   ├── api/              # Flask routes for user, message, ticket, and llm
│   ├── LLMAgent/         # Agent code including prompts and tools
│   ├── models            # Models for DB and reset_db.py
│   ├── repositories      # Repository classes for data models
│   ├── services          # Service for the api that utilize respective repositories
│   ├── utils             # Utility functions
│   ├── .env              # Backend environment variables
│   ├── requirements.txt  # Python Requirements for venv
│   └── main_app.py       # Flask app
├── dashboard_frontend/   # Next.js frontend application
├── .venv/                # Python virtual environment
└── README.md             # This file

``` 


## Future Work

### Security Enhancements
- Implement robust authentication and authorization system
  - JWT-based user authentication
  - Role-based access control (RBAC)
  - Session management
  - Secure password hashing and storage
- Enable HTTPS/SSL
- Add rate limiting for API endpoints
- Implement API key management

### Additional Features
- User management system
- Audit logging
- Enhanced error handling and monitoring
- Automated backup system for the database
- Input sanitization and validation across all endpoints
- Comprehensive test suite (unit tests, integration tests)