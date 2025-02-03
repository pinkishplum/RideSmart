# file: backend/endpoints.py
from flask import request, jsonify, Blueprint
from .proccessing import get_fake_prices

api = Blueprint("proccess", __name__)

@api.route("/get_prices", methods=["POST"])
def get_prices():
    data = request.json or {}
    user_id = str(data.get("user_id", ""))
    distance = float(data.get("distance", 0))

    # If user_id is missing, return error
    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    # Generate fake price data
    results = get_fake_prices(distance, user_id)

    # Return immediately
    return jsonify({"results": results}), 200
