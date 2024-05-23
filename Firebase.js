import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBdXIXbiaFEBL1nNnXSM-iYh1lRuiX62Zo",
  authDomain: "to-do-list-37c5e.firebaseapp.com",
  databaseURL: "https://to-do-list-37c5e-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "to-do-list-37c5e",
  storageBucket: "to-do-list-37c5e.appspot.com",
  messagingSenderId: "865549584694",
  appId: "1:865549584694:web:2694e7e5a4caf695fe0b97"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth();

