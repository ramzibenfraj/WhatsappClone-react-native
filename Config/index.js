// Import the functions you need from the SDKs you need
import app from "firebase/compat/app";

import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/storage";

const {
  EXPO_PUBLIC_FIREBASE_API_KEY,
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  EXPO_PUBLIC_FIREBASE_APP_ID,
} = process.env;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBNVS3uMIjTevaIET54_hnTCni1J3eBSs",
  authDomain: "whatsapp-25747.firebaseapp.com",
  databaseURL: "https://whatsapp-25747-default-rtdb.firebaseio.com",
  projectId: "whatsapp-25747",
  storageBucket: "whatsapp-25747.appspot.com",
  messagingSenderId: "818220765399",
  appId: "1:818220765399:web:0fd233ea90259ecddb6092",
  measurementId: "G-6754VZRCG0"
};

// Initialize Firebase
const firebase = app.initializeApp(firebaseConfig);
export default firebase;
