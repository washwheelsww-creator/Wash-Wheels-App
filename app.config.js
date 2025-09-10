// app.config.js
require('dotenv').config();

export default {
  expo: {
    name: "Wash Wheels",
    slug: "wash-wheels",
    version: "1.0.0",
    sdkVersion: "53.0.0",
    extra: {
      EXPO_FIREBASE_API_KEY: process.env.EXPO_FIREBASE_API_KEY,
      EXPO_FIREBASE_AUTH_DOMAIN: process.env.EXPO_FIREBASE_AUTH_DOMAIN,
      EXPO_FIREBASE_PROJECT_ID: process.env.EXPO_FIREBASE_PROJECT_ID,
      EXPO_FIREBASE_STORAGE_BUCKET: process.env.EXPO_FIREBASE_STORAGE_BUCKET,
      EXPO_FIREBASE_MESSAGING_SENDER_ID: process.env.EXPO_FIREBASE_MESSAGING_SENDER_ID,
      EXPO_FIREBASE_APP_ID: process.env.EXPO_FIREBASE_APP_ID,
      EXPO_FIREBASE_MEASUREMENT_ID: process.env.EXPO_FIREBASE_MEASUREMENT_ID
    }
  }
};