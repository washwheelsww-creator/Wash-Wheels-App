//firebase.js
import {  getApps,initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { getStorage }      from "firebase/storage";
import Constants from "expo-constants"

const{
  EXPO_FIREBASE_API_KEY,
  EXPO_FIREBASE_AUTH_DOMAIN,
  EXPO_FIREBASE_PROJECT_ID,
  EXPO_FIREBASE_STORAGE_BUCKET,
  EXPO_FIREBASE_MESSAGING_SENDER_ID,
  EXPO_FIREBASE_APP_ID,
  EXPO_APP_FIREBASE_MEASUREMENT_ID
} = Constants.expoConfig.extra ?? {} ;

const firebaseConfig = {
  apiKey:            EXPO_FIREBASE_API_KEY,
  authDomain:        EXPO_FIREBASE_AUTH_DOMAIN,
  projectId:         EXPO_FIREBASE_PROJECT_ID,
  storageBucket:     EXPO_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: EXPO_FIREBASE_MESSAGING_SENDER_ID,
  appId:             EXPO_FIREBASE_APP_ID,
  measurementId:     EXPO_APP_FIREBASE_MEASUREMENT_ID
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)});
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, provider, db, storage,collection, onSnapshot, doc, getDoc, query, where }

