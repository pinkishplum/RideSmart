from flask import Flask
from backend.endpoints import app as firebase_endpoints  # Import Firebase-based endpoints

app = Flask(__name__)

# Register the Firebase-based endpoints
app.register_blueprint(firebase_endpoints, url_prefix='/api')

if __name__ == '__main__':
    # Use port 5001 or any port of your choice
    app.run(host='0.0.0.0', port=5001, debug=True)