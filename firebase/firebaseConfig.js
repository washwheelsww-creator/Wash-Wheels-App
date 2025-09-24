// firebase/firebaseConfig.js
import Constants from 'expo-constants'
import { initializeApp } from 'firebase/app'

// Desestructuramos las vars que pusiste en app.config.js -> extra
const {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId
} = Constants.expoConfig.extra

// Creamos el objeto de configuración de Firebase
const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId
}

// Inicializamos la app de Firebase
const firebaseApp = initializeApp(firebaseConfig)

export default firebaseApp