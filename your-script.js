// Importar Firebase
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Configuración de Firebase (usa la tuya)
const firebaseConfig = {
  apiKey: "AQUI_TU_API_KEY",
  authDomain: "ojo-ciudadano-8fc47.firebaseapp.com",
  projectId: "ojo-ciudadano-8fc47",
  storageBucket: "ojo-ciudadano-8fc47.appspot.com",
  messagingSenderId: "114518154337",
  appId: "1:114518154337:web:a3d2fb6549521a33c5e20",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
