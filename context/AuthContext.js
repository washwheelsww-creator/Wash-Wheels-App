// context/AuthContext.js
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          let profileData = {};
          try {
            const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (snap.exists()) profileData = snap.data();
          } catch (err) {
            console.warn('No se pudo leer users doc:', err);
          }

          const profileName = firebaseUser?.displayName ?? profileData?.displayName ?? null;

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: profileData?.role ?? null,
            username: profileData?.username ?? null,
            displayName: profileName,
          });
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error('Error en auth listener:', e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // iniciar sesión
  async function signIn(email, password) {
    const { user: fUser } = await signInWithEmailAndPassword(auth, email, password);
    if (!fUser.emailVerified) {
      await sendEmailVerification(fUser);
      throw new Error('Verifica tu correo antes de continuar');
    }
    let profileData = {};
    try {
      const snap = await getDoc(doc(db, 'users', fUser.uid));
      if (snap.exists()) profileData = snap.data();
    } catch (err) {
      console.warn('No se pudo leer users doc al signIn:', err);
    }

    setUser({
      uid: fUser.uid,
      email: fUser.email,
      role: profileData?.role ?? null,
      username: profileData?.username ?? null,
      displayName: fUser.displayName ?? profileData?.displayName ?? null,
    });

    return fUser;
  }

  // registrar usuario
  async function signUp({ email, password, username, displayName, role = 'cliente' }) {
    const { user: fUser } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(fUser, { displayName });
    await sendEmailVerification(fUser);
    await setDoc(doc(db, 'users', fUser.uid), {
      username,
      displayName,
      email,
      role,
      createdAt: serverTimestamp(),
    });
    setUser({
      uid: fUser.uid,
      email: fUser.email,
      role,
      username,
      displayName,
    });
    return fUser;
  }

  // cerrar sesión
  async function logout() {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, logout }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}