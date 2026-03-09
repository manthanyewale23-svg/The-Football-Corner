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
      setUserData(null);
    }
  }

  async function createUserDocument(firebaseUser, extra = {}) {
    const docRef = doc(db, 'users', firebaseUser.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      const newUser = {
        uid: firebaseUser.uid,
        username: extra.username || '',
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

  async function completeOnboarding(chosenUsername) {
    if (!user) throw new Error("No authenticated user");

    // Check if unique
    const isUnique = await checkUsernameUnique(chosenUsername);
    if (!isUnique) {
      throw new Error("Username is already taken. Please choose another one.");
    }

    // Attach to document
    const docRef = doc(db, 'users', user.uid);
    await setDoc(docRef, { username: chosenUsername }, { merge: true });

    // Update local state
    setUserData(prev => ({ ...prev, username: chosenUsername }));
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

  // update local state
  async function updateUserData(updates) {
    if (user) {
      try {
        const docRef = doc(db, 'users', user.uid);
        await setDoc(docRef, updates, { merge: true });
      } catch {
        // ignore
      }
    }
    setUserData(prev => ({ ...prev, ...updates }));
  }

  return (
    <AuthContext.Provider value={{
      user, userData, loading, error,
      loginWithGoogle, loginWithEmail, completeOnboarding,
      signupWithEmail, logout, updateUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
