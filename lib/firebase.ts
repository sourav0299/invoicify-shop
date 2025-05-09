
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBGkYkuSrOkgkfpl-hZweQdJOpZNmhZwmE",
  authDomain: "invoicify-d258f.firebaseapp.com",
  projectId: "invoicify-d258f",
  storageBucket: "invoicify-d258f.firebasestorage.app",
  messagingSenderId: "446713700821",
  appId: "1:446713700821:web:996441fe8c284487f6dd5c",
  measurementId: "G-JW8773FB5D"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)