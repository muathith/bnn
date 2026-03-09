// firebase.ts
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBX7ZiWymksAT6HHEhr7Dn5MP5hbfxR0WI",
  authDomain: "trree-3500d.firebaseapp.com",
  databaseURL: "https://trree-3500d-default-rtdb.firebaseio.com",
  projectId: "trree-3500d",
  storageBucket: "trree-3500d.firebasestorage.app",
  messagingSenderId: "308719418224",
  appId: "1:308719418224:web:7fa716c10e3a5fa66a6db5",
  measurementId: "G-77L0KDW603",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);

export { auth, db, database };
