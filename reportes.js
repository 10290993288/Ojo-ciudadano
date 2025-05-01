import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

// Verifica si el usuario está autenticado
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "index.html";
    }
});

// Cerrar sesión
document.getElementById("cerrarSesion").addEventListener("click", async () => {
    try {
        await signOut(auth);
        window.location.href = "index.html";
    } catch (error) {
        alert("Error al cerrar sesión: " + error.message);
    }
});

// Convertir imagen a base64
function convertirABase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Enviar reporte
document.getElementById("formReporte").addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const ubicacion = document.getElementById("ubicacion").value || "Ubicación no especificada";
  const fecha = new Date().toLocaleString();
  const imagenInput = document.getElementById("imagen");
  let imagenBase64 = "";

  // Extraer coordenadas
  let lat = null, lng = null;
  const match = ubicacion.match(/Lat: (-?\d+(\.\d+)?), Lon: (-?\d+(\.\d+)?)/);
  if (match) {
      lat = parseFloat(match[1]);
      lng = parseFloat(match[3]);
  }

  if (!titulo || !descripcion) {
      alert("Por favor, completa todos los campos.");
      return;
  }

  if (imagenInput.files.length > 0) {
      imagenBase64 = await convertirABase64(imagenInput.files[0]);
  }

  const reporte = { titulo, descripcion, ubicacion, fecha, imagenBase64, lat, lng };

  try {
      await addDoc(collection(db, "reportes"), reporte);
      agregarReporte(reporte);
      document.getElementById("formReporte").reset();
  } catch (error) {
      alert("Error al guardar el reporte: " + error.message);
  }
});


// Mostrar reporte
function agregarReporte(reporte, id = null) {
    const lista = document.getElementById("listaReportes");
    const item = document.createElement("li");
    item.classList.add("reporte-item");

    const imagenHTML = reporte.imagenBase64
        ? `<img src="${reporte.imagenBase64}" class="imagen-reporte">`
        : "";

    item.innerHTML = `
        <div class="reporte-texto">
            <p><b>Título:</b> ${reporte.titulo}</p>
            <p><b>Descripción:</b> ${reporte.descripcion}</p>
            <p><b>Fecha:</b> ${reporte.fecha}</p>
            <p><b>Ubicación:</b> ${reporte.ubicacion}</p>
        </div>
        ${imagenHTML}
        <button class="boton-eliminar">Eliminar</button>
    `;

    if (id) {
        item.querySelector(".boton-eliminar").addEventListener("click", async () => {
            try {
                await deleteDoc(doc(db, "reportes", id));
                item.remove();
            } catch (error) {
                alert("Error al eliminar: " + error.message);
            }
        });
    }

    lista.appendChild(item);

    // Si el reporte tiene coordenadas, agregar marcador en el mapa
    if (reporte.latitud && reporte.longitud) {
        agregarMarcadorAlMapa(reporte.latitud, reporte.longitud, reporte.titulo, reporte.descripcion);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Cargar reportes
async function cargarReportes() {
    const lista = document.getElementById("listaReportes");
    lista.innerHTML = "";
    const querySnapshot = await getDocs(collection(db, "reportes"));
    querySnapshot.forEach((docSnap) => {
        agregarReporte(docSnap.data(), docSnap.id);
    });
}

// Obtener ubicación
window.obtenerUbicacion = function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                document.getElementById("ubicacion").value = `Lat: ${lat}, Lon: ${lon}`;
                alert("Ubicación obtenida correctamente.");
            },
            function (error) {
                alert("No se pudo obtener la ubicación: " + error.message);
            }
        );
    } else {
        alert("La geolocalización no es compatible con este navegador.");
    }
};

// Agregar marcador al mapa de Mapbox
function agregarMarcadorAlMapa(lat, lon, titulo, descripcion) {
    const mapa = window.map; // Asumiendo que ya tienes un mapa de Mapbox inicializado
    new mapboxgl.Marker()
        .setLngLat([lon, lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${titulo}</h3><p>${descripcion}</p>`))
        .addTo(mapa);
}

// Cargar al iniciar
document.addEventListener("DOMContentLoaded", cargarReportes);
