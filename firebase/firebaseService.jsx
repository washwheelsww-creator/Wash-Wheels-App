//app/firebase/firebaseService.jsx
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, sendEmailVerification,} from "firebase/auth";
import { Alert } from "react-native";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

export async function registerUserWithProfile({ email, password, username, displayName }) { 
  try {
    if (!email.includes("@")) {
    throw new Error("Correo inválido");}
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Usuario registrado", user.uid);
     await updateProfile(user, { displayName });
     const actionCodeSettings = { url: 'https://wash-wheels.firebaseapp.com', handleCodeInApp: false };

     await sendEmailVerification(user, actionCodeSettings);
     await setDoc(doc(db, "users", user.uid), { 
      username, displayName, email, role: 'Cliente', createdAt: serverTimestamp(), });
 
    console.log("Email de verificación enviado a:", email);
    Alert.alert("¡Mail de verificación enviado! Revisa tu bandeja.","Revisa tu bandeja de entrada y, si no lo ves en unos minutos, revisa la carpeta de spam o promociones.");
    return user;}
     catch (error) {
     console.error("Error en registro:", error);
     throw error;}
};

export const loginUser = async (email, password) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    console.log("Inicio de sesión exitoso:", user.uid);
    if (!user.emailVerified) {
      const actionCodeSettings = {
        url: 'https://wash-wheels.firebaseapp.com',
        handleCodeInApp: false
      };
     await sendEmailVerification(user,actionCodeSettings);
     Alert.alert( "Correo no verificado", "Te hemos reenviado el correo de verificación. Por favor verifica tu cuenta antes de continuar.","Revisa tu bandeja de entrada y, si no lo ves en unos minutos, revisa la carpeta de spam o promociones.");
}

    return user;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};

export const cerrarSesion = async () => {
  try {
    await signOut(auth);
    console.log("Sesión cerrada exitosamente");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    throw error;
  }
};