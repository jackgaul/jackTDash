from flask import Flask
from api import api
from utils.db import init_db

app = Flask(__name__)

# Initialize database
init_db()

# Register API routes
app.register_blueprint(api)

if __name__ == "__main__":
    app.run(debug=True)
