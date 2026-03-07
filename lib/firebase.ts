// firebase.ts
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // Paste config here
  apiKey: "AIzaSyDUGrB4tobsQ38Ipn8XRMDxlIbnVSzktnU",
  authDomain: "erewq-70a8d.firebaseapp.com",
  projectId: "erewq-70a8d",
  storageBucket: "erewq-70a8d.firebasestorage.app",
  messagingSenderId: "745154899013",
  appId: "1:745154899013:web:93aa54aa4e60341d46c72c",
  measurementId: "G-J4HRBNVPVM"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);

export { auth, db, database };
