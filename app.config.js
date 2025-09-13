export default {
  expo: {
    name: "Wash Wheels",
    slug: "wash-wheels",
    scheme: "washwheels",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      }
    },
    web: {
      favicon: "./assets/images/favicon.png"
    },
    extra: {
      apiKey: process.env.EXPO_FIREBASE_API_KEY,
      authDomain: process.env.EXPO_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.EXPO_FIREBASE_PROJECT_ID,
      storageBucket: process.env.EXPO_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.EXPO_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.EXPO_FIREBASE_APP_ID,
      measurementId: process.env.EXPO_FIREBASE_MEASUREMENT_ID,
    }

  }
};