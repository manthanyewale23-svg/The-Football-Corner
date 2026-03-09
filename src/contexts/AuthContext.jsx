import { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
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

  async function loadUserData(uid) {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    } catch {
      // Use demo mode if Firebase isn't configured
      setUserData(getDemoUserData());
    }
  }

  async function createUserDocument(firebaseUser, extra = {}) {
    const docRef = doc(db, 'users', firebaseUser.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      const newUser = {
        uid: firebaseUser.uid,
        username: extra.username || firebaseUser.displayName || 'Football Fan',
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

  async function loginWithGoogle() {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      await createUserDocument(result.user);
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
