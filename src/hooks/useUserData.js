// hooks/useUserData.js
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";

/*
  Hook simple que devuelve user y loading.
  role no se usa para lectura de datos en este ejemplo,
  pero queda para lógica condicional (p. ej. colecciones distintas).
*/
export default function useUserData(role = "cliente") {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) {
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }
        const path = role === "lavador" ? "lavadores" : "usuarios";
        const snap = await getDoc(doc(db, path, uid));
        if (mounted) {
          setUser(snap.exists() ? { id: snap.id, ...snap.data() } : { id: uid, name: auth.currentUser?.displayName ?? null, email: auth.currentUser?.email ?? null });
        }
      } catch (err) {
        console.error("useUserData error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => {
      mounted = false;
    };
  }, [role]);

  return { user, loading };
}