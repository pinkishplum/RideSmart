import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXECAGY_y3aGS9Hb33Nxtseauo0VRgujs",
  authDomain: "ridesmart-9fa62.firebaseapp.com",
  projectId: "ridesmart-9fa62",
  storageBucket: "ridesmart-9fa62.firebasestorage.app",
  messagingSenderId: "112915821320",
  appId: "1:112915821320:web:1b401a919fafa5a99a72bd",
  measurementId: "G-291WXZERT8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

console.log('Firebase Initialized:', app);

