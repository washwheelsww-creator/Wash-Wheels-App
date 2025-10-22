import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";

const firebaseConfig = { /* carga from Constants or env */ };
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
if (__DEV__) connectStorageEmulator(storage, "localhost", 9199);
export default app;