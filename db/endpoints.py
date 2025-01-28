"""db/endpoints.py"""

from flask import Blueprint, jsonify, request
import sqlite3

from db.db import (
    add_user,
    user_exists,
    get_user_by_email_and_password,
    get_user_by_id,
)

api = Blueprint('db', __name__)

@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    email = data.get('email')
    password = data.get('password')

    if not all([first_name, last_name, email, password]):
        return jsonify({"error": "Missing required fields"}), 400

    if user_exists(email):
        return jsonify({"error": "User already exists"}), 400

    add_user(first_name, last_name, email, password)
    return jsonify({"message": "User registered successfully"}), 201

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Admin bypass
    if email == "admin@admin" and password == "admin":
        return jsonify({
            "message": "Admin logged in successfully",
            "user_id": 1000,
            "first_name": "admin",
            "last_name": "admin",
            "email": "admin@admin",
        }), 200

    user = get_user_by_email_and_password(email, password)
    if user:
        user_id, first_name, last_name, user_email = user
        return jsonify({
            "message": "User logged in successfully",
            "user_id": user_id,
            "first_name": first_name,
            "last_name": last_name,
            "email": user_email,
        }), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401


@api.route('/user/<int:user_id>', methods=['GET'])
def get_user_info(user_id):
    user = get_user_by_id(user_id)
    if user:
        user_id, first_name, last_name, email = user
        return jsonify({
            "user_id": user_id,
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
        }), 200
    else:
        return jsonify({"error": "User not found"}), 404


@api.route('/user/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    email = data.get('email')

    if not all([first_name, last_name, email]):
        return jsonify({"error": "Missing required fields"}), 400

    # Check if user exists
    existing_user = get_user_by_id(user_id)
    if not existing_user:
        return jsonify({"error": "User not found"}), 404

    try:
        connection = sqlite3.connect('database.db')
        cursor = connection.cursor()

        cursor.execute("""
            UPDATE User
            SET first_name = ?, last_name = ?, email = ?
            WHERE id = ?
        """, (first_name, last_name, email, user_id))

        connection.commit()
        connection.close()

        return jsonify({"message": "User updated successfully"}), 200
    except Exception as e:
        print("Error updating user:", e)
        return jsonify({"error": "Database error"}), 500

@api.route('/save_ride_and_trip', methods=['POST'])
def save_ride_and_trip():
    """
    Example JSON body:
    {
      "user_id": 2,
      "start_point": "Your pickup",
      "destination": "Your destination",
      "price_uber": 20.0,
      "price_careem": 15.0,
      "price_bolt": 22.5,
      "price_jeeny": 18.0,
      "distance_km": 12.5,
      "date": "2024-12-31",
      "time": "13:30"
    }
    """
    data = request.get_json()
    user_id = data.get('user_id')
    start_point = data.get('start_point')
    destination = data.get('destination')
    price_uber = data.get('price_uber', 0.0)
    price_careem = data.get('price_careem', 0.0)
    price_bolt = data.get('price_bolt', 0.0)
    price_jeeny = data.get('price_jeeny', 0.0)
    distance_km = data.get('distance_km', 0.0)  # <--- New field
    date = data.get('date')
    time = data.get('time')

    # Basic validation
    if not all([user_id, start_point, destination, date, time]):
        return jsonify({"error": "Missing required fields"}), 400

    ride_id = None
    try:
        connection = sqlite3.connect('database.db')
        cursor = connection.cursor()

        # Insert into Ride table, now including distance_km
        cursor.execute("""
            INSERT INTO Ride (start_point, destination, price_uber, price_careem, price_bolt, price_jeeny, distance_km)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (start_point, destination, price_uber, price_careem, price_bolt, price_jeeny, distance_km))
        connection.commit()

        ride_id = cursor.lastrowid

        # Insert into Trip table
        cursor.execute("""
            INSERT INTO Trip (user_id, ride_id, date, time)
            VALUES (?, ?, ?, ?)
        """, (user_id, ride_id, date, time))
        connection.commit()

    except sqlite3.IntegrityError as e:
        print(f"Error saving ride/trip: {e}")
        return jsonify({"error": str(e)}), 400
    finally:
        connection.close()

    return jsonify({
        "message": "Ride and trip saved successfully",
        "ride_id": ride_id
    }), 201


@api.route('/past_comparisons/<int:user_id>', methods=['GET'])
def get_past_comparisons(user_id):
    """
    Returns up to 8 of the user's most recent trips, each with:
      - destination
      - date, time
      - app (cheapest)
      - price
    """
    results = []

    connection = sqlite3.connect('database.db')
    cursor = connection.cursor()

    trips = cursor.execute("""
        SELECT trip_id, ride_id, date, time
        FROM Trip
        WHERE user_id = ?
        ORDER BY trip_id DESC
        LIMIT 8
    """, (user_id,)).fetchall()

    for trip_id, ride_id, date, time in trips:
        ride = cursor.execute("""
            SELECT start_point, destination, price_uber, price_careem, price_bolt, price_jeeny
            FROM Ride
            WHERE id = ?
        """, (ride_id,)).fetchone()

        if ride:
            start_point, destination, p_uber, p_careem, p_bolt, p_jeeny = ride

            prices = {
                "Uber": p_uber,
                "Careem": p_careem,
                "Bolt": p_bolt,
                "Jeeny": p_jeeny
            }
            # pick the min among them
            cheapest_app = min(prices, key=prices.get)
            cheapest_price = prices[cheapest_app]

            item = {
                "destination": destination,
                "date": date,
                "time": time,
                "app": cheapest_app,
                "price": cheapest_price
            }
            results.append(item)

    connection.close()

    return jsonify(results), 200