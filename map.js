import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// 🔐 Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAaxktRBxtjrWTWV1aXYHaHs4FzeWcSX1g",
  authDomain: "ojo-ciudadano-8fc47.firebaseapp.com",
  projectId: "ojo-ciudadano-8fc47",
  storageBucket: "ojo-ciudadano-8fc47.appspot.com",
  messagingSenderId: "114518154337",
  appId: "1:114518154337:web:a3d2fb65449521a33c5e20",
  measurementId: "G-ZDGLZMT0BL"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Token de Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoidGF0aWFuYXN1ZXNjYSIsImEiOiJjbTllcnJ5dHUxZDk5MnJvbXdmZjcxeGRtIn0.Wd9dPO_b0xTzTO4Je6YTwg'; // Reemplaza con el tuyo

// Iniciar el mapa
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-74.08175, 4.60971], // Bogotá
  zoom: 12
});

// Verifica autenticación
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Botón cerrar sesión
  const cerrarSesionBtn = document.getElementById("cerrarSesion");
  if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener("click", async () => {
      try {
        await signOut(auth);
        window.location.href = "index.html";
      } catch (error) {
        alert("Error al cerrar sesión: " + error.message);
      }
    });
  }

  // Mostrar reportes en el mapa
  mostrarReportesEnMapa();
});

// Agrega los reportes como marcadores
async function mostrarReportesEnMapa() {
  try {
    const querySnapshot = await getDocs(collection(db, "reportes"));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.lat && data.lng) {
        new mapboxgl.Marker()
          .setLngLat([data.lng, data.lat])
          .setPopup(
            new mapboxgl.Popup().setHTML(`
              <h3>${data.titulo || 'Sin título'}</h3>
              <p>${data.descripcion || 'Sin descripción'}</p>
              <p><em>${data.fecha}</em></p>
            `)
          )
          .addTo(map);
      }
    });
  } catch (error) {
    console.error("Error al mostrar reportes:", error);
  }
}

  
