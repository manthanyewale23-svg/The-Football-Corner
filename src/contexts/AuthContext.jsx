import { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../services/firebase.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await loadUserData(firebaseUser.uid);
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function checkUsernameUnique(testUsername) {
    if (!testUsername) return false;
    // Query users collection to see if this username exists (case-sensitive exact match)
    // For a stricter app, you might maintain a separate lowercase 'usernames' collection
    const q = query(collection(db, 'users'), where('username', '==', testUsername));
    const snap = await getDocs(q);
    return snap.empty; // true if unique, false if already taken
  }

  async function loadUserData(uid) {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    } catch {
      setUserData(getDemoUserData());
    }
  }

  async function createUserDocument(firebaseUser, extra = {}) {
    const docRef = doc(db, 'users', firebaseUser.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {

      let finalUsername = extra.username;

      // If we somehow get here without a username (e.g. Google login with no extra data), 
      // generate a random unique one so it doesn't default to "Football Fan" for everyone
      if (!finalUsername) {
        const base = (firebaseUser.displayName || 'User').replace(/\s+/g, '');
        finalUsername = `${base}${Math.floor(Math.random() * 90000) + 10000}`;
      }

      const newUser = {
        uid: firebaseUser.uid,
        username: finalUsername,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL || '',
        iqScore: 100,
        fdpResult: null,
        predictionCount: 0,
        correctPredictions: 0,
        createdAt: serverTimestamp(),
      };
      await setDoc(docRef, newUser);
      setUserData(newUser);
    }
  }

  async function loginWithGoogle(desiredUsername = null) {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);

      // Only create the doc if it's a new user, and pass along the desiredUsername
      await createUserDocument(result.user, { username: desiredUsername });
    } catch (e) {
      setError(e.message);
      throw e;
    }
  }

  async function loginWithEmail(email, password) {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      setError(e.message);
      throw e;
    }
  }

  async function signupWithEmail(email, password, username) {
    try {
      setError(null);

      // 1. Strictly enforce uniqueness before doing anything
      const isUnique = await checkUsernameUnique(username);
      if (!isUnique) {
        throw new Error("Username is already taken. Please choose another one.");
      }

      // 2. Create the account
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: username });
      await createUserDocument(result.user, { username });
    } catch (e) {
      setError(e.message);
      throw e;
    }
  }

  async function logout() {
    await signOut(auth);
    setUserData(null);
  }

  // Demo mode: update local state without Firebase
  async function updateUserData(updates) {
    if (user) {
      try {
        const docRef = doc(db, 'users', user.uid);
        await setDoc(docRef, updates, { merge: true });
      } catch {
        // silently ignore in demo mode
      }
    }
    setUserData(prev => ({ ...prev, ...updates }));
  }

  // Demo user for testing without Firebase
  function useDemoLogin() {
    const demoUser = { uid: 'demo123', email: 'demo@footballiq.app', displayName: 'Demo Player' };
    setUser(demoUser);
    setUserData(getDemoUserData());
  }

  return (
    <AuthContext.Provider value={{
      user, userData, loading, error,
      loginWithGoogle, loginWithEmail,
      signupWithEmail, logout, updateUserData, useDemoLogin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

function getDemoUserData() {
  return {
    uid: 'demo123',
    username: 'Football Fan',
    email: 'demo@footballiq.app',
    photoURL: '',
    iqScore: 245,
    fdpResult: null,
    predictionCount: 3,
    correctPredictions: 2,
    predictions: [],
  };
}

export function useAuth() {
  return useContext(AuthContext);
}
