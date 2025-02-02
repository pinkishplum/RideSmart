import os
import json
import firebase_admin
from firebase_admin import credentials, firestore


cred = credentials.Certificate("ridesmart-9fa62-firebase-adminsdk-fbsvc-63a6f51c4d.json")
firebase_admin.initialize_app(cred)

db = firestore.client()