// src/services/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as fbSignOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'YOUR_FIREBASE_API_KEY',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project',
  // ...otros campos si aplica
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);

export const firebaseRegister = async (email: string, password: string) => {
  const userCred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  return userCred.user;
};

export const firebaseLogin = async (email: string, password: string) => {
  const userCred = await signInWithEmailAndPassword(firebaseAuth, email, password);
  return userCred.user;
};

export const firebaseLogout = async () => {
  return fbSignOut(firebaseAuth);
};
