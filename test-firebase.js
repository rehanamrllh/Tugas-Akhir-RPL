import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCw_LX9EjCmUbuRvfm5ysgpVRXK4yoTTM8",
  authDomain: "twice-cafe-pos.firebaseapp.com",
  databaseURL: "https://twice-cafe-pos-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "twice-cafe-pos",
  storageBucket: "twice-cafe-pos.firebasestorage.app",
  messagingSenderId: "473961943123",
  appId: "1:473961943123:web:1bac023b43b1d4a1dcf6a6"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function testFirebase() {
  try {
    console.log("Reading menu...");
    const snapshot = await get(ref(db, 'menu'));
    console.log("Menu data:", snapshot.val());

    console.log("Writing test data to tables...");
    await set(ref(db, 'tables'), [{id: "99", desc: "Test table"}]);
    console.log("Write success!");
    process.exit(0);
  } catch (error) {
    console.error("Firebase error:", error);
    process.exit(1);
  }
}

testFirebase();
