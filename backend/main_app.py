from flask import Flask
from flask_socketio import SocketIO
from api import api
from socket_handlers import MessageNamespace
from flask_cors import CORS

app = Flask(__name__)

CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")


# Register API routes
app.register_blueprint(api)

# Register socket handlers
socketio.on_namespace(MessageNamespace("/socket/messages"))

if __name__ == "__main__":
    socketio.run(app, debug=True)
