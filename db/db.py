""" db/db.py """

import sqlite3

def initialize_db():
    """Initializes the SQLite database with necessary tables and indexes."""
    connection = sqlite3.connect('database.db')
    cursor = connection.cursor()

    # Enable foreign key constraints
    cursor.execute("PRAGMA foreign_keys = ON;")

    # Create User table
    user_command = """
    CREATE TABLE IF NOT EXISTS User (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    );"""

    # Create Ride table (added distance_km column)
    ride_command = """
    CREATE TABLE IF NOT EXISTS Ride (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        start_point TEXT NOT NULL,
        destination TEXT NOT NULL,
        price_uber REAL NOT NULL,
        price_careem REAL NOT NULL,
        price_bolt REAL NOT NULL,
        price_jeeny REAL NOT NULL,
        distance_km REAL NOT NULL DEFAULT 0
    );"""

    # Create Trip table
    trip_command = """
    CREATE TABLE IF NOT EXISTS Trip (
        trip_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        ride_id INTEGER NOT NULL,
        date TEXT NOT NULL,    -- ISO format YYYY-MM-DD
        time TEXT NOT NULL,    -- 24-hour format HH:MM
        FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
        FOREIGN KEY (ride_id) REFERENCES Ride(id) ON DELETE CASCADE,
        UNIQUE (user_id, ride_id, date, time) -- Prevent duplicate trips
    );"""

    # Create Offer table
    offer_command = """
    CREATE TABLE IF NOT EXISTS Offer (
        number INTEGER PRIMARY KEY AUTOINCREMENT,
        company TEXT NOT NULL,
        offer_description TEXT NOT NULL
    );"""

    # Execute table creation commands
    cursor.execute(user_command)
    cursor.execute(ride_command)
    cursor.execute(trip_command)
    cursor.execute(offer_command)

    # Commit changes and close connection
    connection.commit()
    connection.close()

def add_user(first_name, last_name, email, password):
    """Adds a new user to the User table with hashed password."""
    connection = sqlite3.connect('database.db')
    cursor = connection.cursor()
    try:
        cursor.execute("""
        INSERT INTO User (first_name, last_name, email, password)
        VALUES (?, ?, ?, ?)
        """, (first_name, last_name, email, password))
        connection.commit()
    except sqlite3.IntegrityError as e:
        print(f"Error inserting user: {e}")
    finally:
        connection.close()

def add_ride(company, start_point, destination, price_uber, price_careem, price_bolt, price_jeeny):
    """
    Adds a new ride to the Ride table.
    NOTE: This function signature currently includes 'company', but the table does not.
    You can modify it as needed or omit 'company' if no longer necessary.
    """
    connection = sqlite3.connect('database.db')
    cursor = connection.cursor()
    try:
        cursor.execute("""
        INSERT INTO Ride (start_point, destination, price_uber, price_careem, price_bolt, price_jeeny)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (start_point, destination, price_uber, price_careem, price_bolt, price_jeeny))
        connection.commit()
    except sqlite3.IntegrityError as e:
        print(f"Error inserting ride: {e}")
    finally:
        connection.close()


def add_trip(user_id, ride_id, date, time):
    """Adds a new trip to the Trip table."""
    connection = sqlite3.connect('database.db')
    cursor = connection.cursor()
    try:
        cursor.execute("""
        INSERT INTO Trip (user_id, ride_id, date, time)
        VALUES (?, ?, ?, ?)
        """, (user_id, ride_id, date, time))
        connection.commit()
    except sqlite3.IntegrityError as e:
        print(f"Error inserting trip: {e}")
    finally:
        connection.close()

def add_offer(company, offer_description):
    """Adds a new offer to the Offer table."""
    connection = sqlite3.connect('database.db')
    cursor = connection.cursor()
    try:
        cursor.execute("""
        INSERT INTO Offer (company, offer_description)
        VALUES (?, ?)
        """, (company, offer_description))
        connection.commit()
    except sqlite3.IntegrityError as e:
        print(f"Error inserting offer: {e}")
    finally:
        connection.close()

def user_exists(email):
    connection = sqlite3.connect('database.db')
    cursor = connection.cursor()
    cursor.execute("SELECT id FROM User WHERE email=?", (email,))
    user = cursor.fetchone()
    connection.close()
    return user is not None

def get_user_by_email_and_password(email, password):
    connection = sqlite3.connect('database.db')
    cursor = connection.cursor()
    cursor.execute("SELECT id, first_name, last_name, email FROM User WHERE email=? AND password=?", (email, password))
    user = cursor.fetchone()
    connection.close()
    return user  # (id, first_name, last_name, email) or None if not found

def get_user_by_id(user_id):
    connection = sqlite3.connect('database.db')
    cursor = connection.cursor()
    cursor.execute("SELECT id, first_name, last_name, email FROM User WHERE id=?", (user_id,))
    user = cursor.fetchone()
    connection.close()
    return user


if __name__ == "__main__":
    # Initialize (or re-initialize) the database and create tables
    initialize_db()
    print(get_user_by_id(2))