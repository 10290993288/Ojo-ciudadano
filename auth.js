import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const emailInput = document.querySelector("input[type='email']");
    const passwordInput = document.querySelector("input[type='password']");
    const loginButton = document.querySelector("button:nth-of-type(1)");
    const registerButton = document.querySelector("button:nth-of-type(2)");

    loginButton.addEventListener("click", () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) return alert("Por favor completa los campos.");

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                window.location.href = "reportes.html";
            })
            .catch((error) => {
                alert("Error al iniciar seccion "+error );
            });
    });

    registerButton.addEventListener("click", () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) return alert("Por favor completa los campos.");

        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                alert("Registro exitoso. Ahora puedes iniciar sesión.");
            })
            .catch((error) => {
                alert("Error al registrar: " + error.message);

            });
    });
    
});
