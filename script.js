// script.js (para la página de login)
document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    let usuario = document.getElementById("usuario").value.trim();
    let password = document.getElementById("password").value.trim();
    let errorMensaje = document.getElementById("errorMensaje");

    // **IMPORTANTE: En un sistema real, esto iría a un servidor para autenticar**
    // Este es solo un ejemplo para mantener la funcionalidad de demo sin backend
    const usuariosValidos = {
        "usuario": "1234",
        "pdi": "pdi123",
        "sag": "sag123",
        "aduana": "aduana123"
    };

    if (usuariosValidos[usuario] && usuariosValidos[usuario] === password) {
        localStorage.setItem("usuario", usuario);
        window.location.href = "dashboard.html";
    } else {
        errorMensaje.innerText = "Usuario o contraseña incorrectos.";
        errorMensaje.style.color = "#ffcccc"; // Asegura que el color de error sea visible
    }
});