// context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut,
  sendEmailVerification, updateProfile} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp} from 'firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1) Monitorea el estado de auth de Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Recupera el role desde Firestore
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
        const role = snap.exists() ? snap.data().role : null;
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email, role });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // 2) Función para iniciar sesión
  async function signIn(email, password) {
    const { user: fUser } = await signInWithEmailAndPassword(auth, email, password);
    if (!fUser.emailVerified) {
      await sendEmailVerification(fUser);
      throw new Error('Verifica tu correo antes de continuar');
    }
    const snap = await getDoc(doc(db, 'users', fUser.uid));
    const role = snap.exists() ? snap.data().role : null;
    setUser({ uid: fUser.uid, email: fUser.email, role });
    return fUser;
  }

  // 3) Función para registrar usuario con perfil
  async function signUp({ email, password, username, displayName, role = 'Cliente' }) {
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
    setUser({ uid: fUser.uid, email: fUser.email, role });
    return fUser;
  }

  // 4) Cerrar sesión
  async function logout() {
    await signOut(auth);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, logout }}>
      {/* Esperamos a que termine de cargar estado */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}