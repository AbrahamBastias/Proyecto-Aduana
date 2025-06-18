// document.js (Solo para la sección de subir documentos del usuario "normal")
document.addEventListener("DOMContentLoaded", function () {
    // Solo inicializa este formulario si el usuario es "usuario"
    if (localStorage.getItem("usuario") === "usuario") {
        const documentForm = document.getElementById("documentForm");
        if (documentForm) {
            documentForm.addEventListener("submit", function (event) {
                event.preventDefault();
                subirDocumento();
            });
        }
    }
});


function subirDocumento() {
    let nombre = document.getElementById("nombre").value;
    let rut = document.getElementById("rut").value;
    let correo = document.getElementById("correo").value;
    let direccion = document.getElementById("direccion").value;
    let telefono = document.getElementById("telefono").value;
    let fecha_nacimiento = document.getElementById("fecha_nacimiento").value;
    let comentarios = document.getElementById("comentarios").value;

    let foto_carnet_file = document.getElementById("foto_carnet").files[0];
    let declaracion_sag_file = document.getElementById("declaracion_sag").files[0];
    let elementos_pdi_file = document.getElementById("elementos_pdi").files[0];

    if (!foto_carnet_file || !declaracion_sag_file || !elementos_pdi_file) {
        alert("Por favor, sube todos los archivos requeridos.");
        return;
    }

    let documento = {
        nombre,
        rut,
        correo,
        direccion,
        telefono,
        fecha_nacimiento,
        comentarios,
        // **IMPORTANTE: Aquí solo se guarda el nombre del archivo. En un sistema real,
        // los archivos se subirían a un servidor y aquí guardarías la URL/ruta.**
        foto_carnet: foto_carnet_file ? foto_carnet_file.name : '',
        declaracion_sag: declaracion_sag_file ? declaracion_sag_file.name : '',
        elementos_pdi: elementos_pdi_file ? elementos_pdi_file.name : '',
        estado: "Pendiente", // Estado general del documento
        estadoSAG: "Pendiente", // Estado específico para SAG
        estadoPDI: "Pendiente", // Estado específico para PDI
        estadoAduana: "Pendiente" // Estado final de Aduana
    };

    // **NOTA: En un sistema real, este documento se enviaría al servidor para guardarse en una DB**
    let documentos = JSON.parse(localStorage.getItem("documentos")) || [];
    documentos.push(documento);
    localStorage.setItem("documentos", JSON.stringify(documentos));

    alert("Documentos enviados para revisión.");
    document.getElementById("documentForm").reset(); // Limpia el formulario
    // Actualiza la lista de documentos subidos por el usuario desde dashboard.js
    if (typeof actualizarListaDocumentosUsuario === 'function') {
        actualizarListaDocumentosUsuario();
    }
}