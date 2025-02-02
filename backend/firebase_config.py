import os
import firebase_admin
from firebase_admin import credentials, firestore

# Get the absolute directory of this file
basedir = os.path.abspath(os.path.dirname(__file__))

# Build the absolute path to the service account key file
cert_path = os.path.join(basedir, "ridesmart-9fa62-firebase-adminsdk-fbsvc-63a6f51c4d.json")

# Use the absolute path to initialize the credentials
cred = credentials.Certificate(cert_path)
firebase_admin.initialize_app(cred)

db = firestore.client()