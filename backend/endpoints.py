from flask import Flask, jsonify, request
from firebase_config import db  # This file initializes firebase_admin and Firestore

app = Flask(__name__)

# ----------------- Helper Functions ----------------- #

def user_exists(email):
    """
    Check if a user with the given email exists in Firestore.
    Uses the email as the document ID in the 'users' collection.
    """
    user_ref = db.collection('users').document(email)
    user = user_ref.get()
    return user.exists

def add_user(first_name, last_name, email, password):
    """
    Add a new user to Firestore.
    The document ID is set to the user's email (for uniqueness).
    Passwords are stored in plaintext here for learning purposes.
    """
    user_ref = db.collection('users').document(email)
    user_ref.set({
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "password": password
    })
    print(f"User {email} added successfully.")

def get_user_by_email_and_password(email, password):
    """
    Retrieve a user by email and verify the password.
    Returns the user data if the password matches; otherwise returns None.
    """
    user_ref = db.collection('users').document(email)
    user = user_ref.get()
    if user.exists:
        user_data = user.to_dict()
        if user_data.get('password') == password:
            return user_data
    return None

# ----------------- User Endpoints ----------------- #

@app.route('/register', methods=['POST'])
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

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = get_user_by_email_and_password(email, password)
    if user:
        return jsonify({
            "message": "User logged in successfully",
            "user_id": email,
            "first_name": user.get('first_name'),
            "last_name": user.get('last_name'),
            "email": user.get('email')
        }), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401

@app.route('/users/<email>', methods=['GET'])
def get_user(email):
    """
    Retrieve user details by email.
    """
    user_ref = db.collection('users').document(email)
    user = user_ref.get()
    if user.exists:
        return jsonify(user.to_dict()), 200
    else:
        return jsonify({"error": "User not found"}), 404

# ----------------- Ride Endpoints ----------------- #

@app.route('/rides', methods=['POST'])
def create_ride():
    data = request.get_json()
    start_point = data.get('start_point')
    destination = data.get('destination')
    price_uber = data.get('price_uber', 0.0)
    price_careem = data.get('price_careem', 0.0)
    price_bolt = data.get('price_bolt', 0.0)
    price_jeeny = data.get('price_jeeny', 0.0)
    distance_km = data.get('distance_km', 0.0)

    if not all([start_point, destination]):
        return jsonify({"error": "Missing required fields"}), 400

    # Add the ride to Firestore; Firestore creates the 'rides' collection automatically if it doesn't exist.
    ride_ref = db.collection('rides').add({
        "start_point": start_point,
        "destination": destination,
        "price_uber": price_uber,
        "price_careem": price_careem,
        "price_bolt": price_bolt,
        "price_jeeny": price_jeeny,
        "distance_km": distance_km
    })

    # ride_ref returns a tuple where ride_ref[1].id is the generated document ID.
    return jsonify({"message": "Ride created successfully", "ride_id": ride_ref[1].id}), 201

@app.route('/rides/<ride_id>', methods=['GET'])
def get_ride(ride_id):
    ride_ref = db.collection('rides').document(ride_id)
    ride = ride_ref.get()
    if ride.exists:
        return jsonify(ride.to_dict()), 200
    else:
        return jsonify({"error": "Ride not found"}), 404

# ----------------- Trip Endpoints ----------------- #

@app.route('/trips', methods=['POST'])
def create_trip():
    data = request.get_json()
    user_email = data.get('user_email')
    ride_id = data.get('ride_id')
    date = data.get('date')
    time = data.get('time')

    if not all([user_email, ride_id, date, time]):
        return jsonify({"error": "Missing required fields"}), 400

    # Create the trip document; Firestore creates the 'trips' collection automatically.
    trip_ref = db.collection('trips').add({
        "user_id": f"users/{user_email}",
        "ride_id": f"rides/{ride_id}",
        "date": date,
        "time": time
    })

    return jsonify({"message": "Trip created successfully"}), 201

@app.route('/trips/<trip_id>', methods=['GET'])
def get_trip(trip_id):
    trip_ref = db.collection('trips').document(trip_id)
    trip = trip_ref.get()
    if trip.exists:
        return jsonify(trip.to_dict()), 200
    else:
        return jsonify({"error": "Trip not found"}), 404

# ----------------- Offer Endpoints ----------------- #

@app.route('/offers', methods=['POST'])
def create_offer():
    data = request.get_json()
    company = data.get('company')
    offer_description = data.get('offer_description')

    if not all([company, offer_description]):
        return jsonify({"error": "Missing required fields"}), 400

    # Add the offer to Firestore; Firestore creates the 'offers' collection automatically.
    offer_ref = db.collection('offers').add({
        "company": company,
        "offer_description": offer_description
    })

    return jsonify({"message": "Offer created successfully"}), 201

@app.route('/offers/<offer_id>', methods=['GET'])
def get_offer(offer_id):
    offer_ref = db.collection('offers').document(offer_id)
    offer = offer_ref.get()
    if offer.exists:
        return jsonify(offer.to_dict()), 200
    else:
        return jsonify({"error": "Offer not found"}), 404

# ----------------- Past Comparisons Endpoint ----------------- #

@app.route('/past_comparisons/<user_email>', methods=['GET'])
def get_past_comparisons(user_email):
    results = []

    # Query the 'trips' collection for trips belonging to the given user.
    trips_ref = db.collection('trips').where('user_id', '==', f'users/{user_email}').stream()

    for trip in trips_ref:
        trip_data = trip.to_dict()
        # The ride_id is stored as "rides/<documentID>", so split to get the document ID.
        ride_id = trip_data.get('ride_id', '').split('/')[-1]
        ride_ref = db.collection('rides').document(ride_id)
        ride = ride_ref.get()

        if ride.exists:
            ride_data = ride.to_dict()
            prices = {
                "Uber": ride_data.get('price_uber', 0.0),
                "Careem": ride_data.get('price_careem', 0.0),
                "Bolt": ride_data.get('price_bolt', 0.0),
                "Jeeny": ride_data.get('price_jeeny', 0.0)
            }
            # Determine the cheapest option.
            cheapest_app = min(prices, key=prices.get)
            cheapest_price = prices[cheapest_app]

            results.append({
                "destination": ride_data.get('destination'),
                "date": trip_data.get('date'),
                "time": trip_data.get('time'),
                "app": cheapest_app,
                "price": cheapest_price
            })

    return jsonify(results), 200

# ----------------- Endpoints Finished ----------------- #

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)