// Firebase authentication setup for user management
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOTDqxHcTAHBGC_XzkqRLOyUu9mCOvR90",
  authDomain: "cropaid-e1101.firebaseapp.com",
  projectId: "cropaid-e1101",
  storageBucket: "cropaid-e1101.firebasestorage.app",
  messagingSenderId: "117592832656",
  appId: "1:117592832656:web:6a2c3c8fd7267397b97615",
  measurementId: "G-HWBWDJ5WF0"
};

let app = null;
let auth = null;

// Initialize Firebase with error handling to prevent app crashes
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization failed:', error.message);
  console.warn('App will continue without Firebase authentication.');

  // Provide mock auth object to allow app to function without Firebase
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback) => {
      callback(null);
      return () => { };
    },
    signOut: () => Promise.resolve(),
    _isInitialized: false,
    _error: error.message
  };
}

export { auth };
export default app;
