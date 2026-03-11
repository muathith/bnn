// firebase.ts
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBEMutxISSdHbL4OotcoKMh1Zv603jWzgw",
  authDomain: "mynewbb-73847.firebaseapp.com",
  databaseURL: "https://mynewbb-73847-default-rtdb.firebaseio.com",
  projectId: "mynewbb-73847",
  storageBucket: "mynewbb-73847.firebasestorage.app",
  messagingSenderId: "1017329682260",
  appId: "1:1017329682260:web:7c8e6a9ece4e91399ceac1",
  measurementId: "G-E5XV1B9R32",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);

export { auth, db, database };
