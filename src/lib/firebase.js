import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCw_LX9EjCmUbuRvfm5ysgpVRXK4yoTTM8",
  authDomain: "twice-cafe-pos.firebaseapp.com",
  databaseURL: "https://twice-cafe-pos-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "twice-cafe-pos",
  storageBucket: "twice-cafe-pos.firebasestorage.app",
  messagingSenderId: "473961943123",
  appId: "1:473961943123:web:1bac023b43b1d4a1dcf6a6",
  measurementId: "G-0V3DXZXLK1"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
