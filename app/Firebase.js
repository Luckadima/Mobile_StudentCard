import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyBJptoLOmIKzaDkimpSb3ZlqK2srXJ1NTs",
  authDomain: "randomproject-44c31.firebaseapp.com",
  projectId: "randomproject-44c31",
  storageBucket: "randomproject-44c31.appspot.com",
  messagingSenderId: "167217786719",
  appId: "1:167217786719:web:9c6d0d2bcff4bba24390ea",
  measurementId: "G-GPBY0C5WG1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore, Auth, and Storage
export const db = getFirestore(app);
export const firebase_auth = getAuth(app);
export const storage = getStorage(app); // Initialize Firebase Storage

// let auth;
// try {
//   auth = initializeAuth(app, {
//     persistence: getReactNativePersistence(ReactNativeAsyncStorage)
//   });
// } catch (error) {
//   if (error.code === 'auth/already-initialized') {
//     // If already initialized, get the existing instance
//     auth = getAuth(app);
//   } else {
//     // Handle other errors
//     console.error("Error initializing Firebase Auth:", error);
//   }
// }

