// AuthContext.js
import { createContext, useState,  useEffect, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, doc, getDoc } from "../firebase/firebase";

export const AuthContext = createContext();
export function useAuth(){ return useContext(AuthContext);}

async function fetchUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : {};}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [pendingFlow, setPendingFlow] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const profile = await fetchUserProfile(firebaseUser.uid);
        setUserProfile(profile);
      } else {
        setUser(null);
        setUserProfile({});
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  return (
    <AuthContext.Provider value={{ user, userProfile, loading, pendingFlow, setPendingFlow }}>
      {children}
    </AuthContext.Provider>
  );
}

