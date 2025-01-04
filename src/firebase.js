// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCBDVoOO1Oi7O25bmMUJoNymasbHvwXCE8",
  authDomain: "campus-connect-3d916.firebaseapp.com",
  projectId: "campus-connect-3d916",
  storageBucket: "campus-connect-3d916.firebasestorage.app",
  messagingSenderId: "411304996352",
  appId: "1:411304996352:web:098eb32c07bb3091ba32e5",
  measurementId: "G-PJH6E1H9PE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
