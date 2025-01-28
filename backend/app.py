"""server/endpoints.py"""

from flask import Flask
from db.db import initialize_db
from db.endpoints import api
from backend.endpoints import api_1

app = Flask(__name__)

# Initialize DB before handling any requests
initialize_db()
app.register_blueprint(api, url_prefix='/db')
app.register_blueprint(api_1, url_prefix='/proccess')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)

