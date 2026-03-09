// Firebase configuration for The Football Corner
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBBRkdwPbk5xy6oDaUM6Rko3iUmcgV2dKM",
  authDomain: "the-football-corner.firebaseapp.com",
  databaseURL: "https://the-football-corner-default-rtdb.firebaseio.com",
  projectId: "the-football-corner",
  storageBucket: "the-football-corner.firebasestorage.app",
  messagingSenderId: "543654282968",
  appId: "1:543654282968:web:3f5043461680a2a160f9ad",
  measurementId: "G-4M9LXQ9VRJ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
