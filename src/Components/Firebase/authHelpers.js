import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./Firebase";

export const signInAdmin = async (email, password) => {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
};

export const listenAuth = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const isAdmin = async (uid) => {
  const ref = doc(db, "admins", uid);
  const snap = await getDoc(ref);
  return snap.exists();
};

export const signOutAdmin = () => signOut(auth);

