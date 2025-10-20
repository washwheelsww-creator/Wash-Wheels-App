// app.config.js
import 'dotenv/config';

export default ({ config }) => {
  // Cuando EXPO_USE_DEV_CLIENT===true cargamos plugins nativos
  const useDevClient = process.env.EXPO_USE_DEV_CLIENT === 'true';

  return {
  ...config,
  expo: {
    ... config,
  name: "Wash Wheels",
  slug: "wash-wheels-app",
  platforms: ["ios", "android"],
  scheme: "washwheels",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  splash: {
  image: "./assets/images/splash-icon.png",
  resizeMode: "contain",
  backgroundColor: "#ffffff" },
  updates: { fallbackToCacheTimeout: 0 },
  assetBundlePatterns: ["**/*"],
  ios: {
   jsEngine: "jsc",
   bundleIdentifier: "com.anonymous.washwheelsapp",
   supportsTablet: true},
  android: {
   jsEngine: "jsc",
   package: "com.anonymous.washwheelsapp",
   adaptiveIcon: {
   foregroundImage: "./assets/images/adaptive-icon.png",
   backgroundColor: "#FFFFFF" }},
  web: { favicon: "./assets/images/favicon.png" },
  extra: {
   apiKey:           process.env.EXPO_FIREBASE_API_KEY,
   authDomain:       process.env.EXPO_FIREBASE_AUTH_DOMAIN,
   projectId:        process.env.EXPO_FIREBASE_PROJECT_ID,
   storageBucket:    process.env.EXPO_FIREBASE_STORAGE_BUCKET,
   messagingSenderId:process.env.EXPO_FIREBASE_MESSAGING_SENDER_ID,
   appId:            process.env.EXPO_FIREBASE_APP_ID,
   measurementId:    process.env.EXPO_FIREBASE_MEASUREMENT_ID,
   eas: { projectId: "fd3356da-e1be-4634-aba2-a8b1a9dd71ba" } },
  plugins: []
  }
 };
};