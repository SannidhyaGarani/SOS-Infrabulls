import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgYCHHU21di53z5H-qKwXdSovnv7sSKB0",
  authDomain: "sosinfrabulls-91525.firebaseapp.com",
  projectId: "sosinfrabulls-91525",
  storageBucket: "sosinfrabulls-91525.firebasestorage.app",
  messagingSenderId: "880643081605",
  appId: "1:880643081605:web:59190e78c3acfd6d52b0ec",
  measurementId: "G-9HWQWV7GRE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, analytics, auth };
export default app;
