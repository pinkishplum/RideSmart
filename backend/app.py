from flask import Flask
from backend.endpoints import api   # Import Firebase-based endpoints

app = Flask(__name__)

# Register the backend endpoint
app.register_blueprint(api, url_prefix='/api')

if __name__ == '__main__':
    # Use port 5001 or any port of your choice
    app.run(host='0.0.0.0', port=5001, debug=True)