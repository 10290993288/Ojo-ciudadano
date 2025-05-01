// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAaxktRBxtjrWTWV1aXYHaHs4FzeWcSX1g",
  authDomain: "ojo-ciudadano-8fc47.firebaseapp.com",
  projectId: "ojo-ciudadano-8fc47",
  storageBucket: "ojo-ciudadano-8fc47.appspot.com",
  messagingSenderId: "114518154337",
  appId: "1:114518154337:web:a3d2fb65449521a33c5e20",
  measurementId: "G-ZDGLZMT0BL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
