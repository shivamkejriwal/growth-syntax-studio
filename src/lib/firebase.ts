
// src/lib/firebase.ts
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
// To enable other Firebase services, import them here
// import { getAuth } from 'firebase/auth';
// import { getStorage } from 'firebase/storage';
// import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  // Use the already initialized app
  app = getApps()[0];
}

const db: Firestore = getFirestore(app);
// const auth = getAuth(app); // Example: Initialize Firebase Authentication
// const storage = getStorage(app); // Example: Initialize Firebase Storage
// const functions = getFunctions(app); // Example: Initialize Firebase Functions

export { app, db /*, auth, storage, functions */ };
