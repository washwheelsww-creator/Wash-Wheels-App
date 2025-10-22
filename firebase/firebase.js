//firebase/firebase.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { getApps, initializeApp } from 'firebase/app';
import { getReactNativePersistence, GoogleAuthProvider, initializeAuth } from "firebase/auth";
import { collection, doc, getDoc, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { Platform } from "react-native";

const manifest = Constants.expoConfig ?? Constants.manifest;
const extra = manifest?.extra || {};

const {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId
} = extra;

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId
};


const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage)});
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);
if (__DEV__) {
  const STORAGE_EMULATOR_HOST = Platform.OS === "android" ? "10.0.2.2" : "localhost";
  try { connectStorageEmulator(storage, STORAGE_EMULATOR_HOST, 9199);
    console.log(`Connected to Storage emulator at ${STORAGE_EMULATOR_HOST}:9199`);
  } catch (e) { console.warn("Failed to connect to Storage emulator:", e);
  } }

export { app, auth, collection, db, doc, getDoc, onSnapshot, provider, query, storage, where };
connectStorageEmulator(storage, 'localhost', 9199);
