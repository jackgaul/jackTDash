# Serval Agent Project

This project consists of a Flask backend with PostgreSQL database and a Next.js frontend dashboard. The application is built using modern web technologies and follows best practices for both frontend and backend development.

## Technology Stack

### Backend
- **Framework**: Flask (Python)
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT-based authentication
- **API Documentation**: OpenAPI/Swagger
- **Additional Libraries**:
  - Flask-CORS for handling cross-origin requests
  - python-dotenv for environment variable management
  - psycopg2 for PostgreSQL database connection
  - OpenAI integration for AI capabilities

### Frontend
- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: React Hooks
- **Package Manager**: pnpm
- **Additional Libraries**:
  - Next-themes for dark/light mode
  - React Hook Form for form handling
  - Various Radix UI components for accessible UI elements

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
cd serval_agent
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
   POSTGRES_DB=serval_db
   OPENAI_API_KEY=your_openai_api_key
   ```
   - Run the database setup script to populate sample tickets:
```bash
cd backend/db_setup
python setup_postgres.py
```

4. Start the Flask backend:
```bash
cd backend
python app.py
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
serval_agent/
├── backend/
│   ├── db_setup/          # Database setup scripts
│   ├── servalAgent/       # Main application code
│   ├── app.py            # Flask application entry point
│   ├── utils.py          # Utility functions
│   └── .env              # Backend environment variables
├── dashboard_frontend/    # Next.js frontend application
├── .venv/                # Python virtual environment
└── requirements.txt      # Python dependencies
``` 