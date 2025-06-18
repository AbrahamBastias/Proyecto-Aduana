// dashboard.js
document.addEventListener("DOMContentLoaded", function () {
    const usuario = localStorage.getItem("usuario");

    if (!usuario) {
        window.location.href = "index.html"; // Redirige al login si no hay usuario
        return;
    }

    document.getElementById("userName").innerText = usuario;
    construirMenu(usuario);
});

function construirMenu(usuario) {
    const menu = document.getElementById("menu");
    menu.innerHTML = "";

    const opciones = {
        "usuario": {
            "Subir Documentos": "documentos",
            "Estado de Solicitud": "estado-solicitud",
            "Preguntas Frecuentes": "faq",
            "Ajustes": "ajustes",
            "Contacto": "contacto"
        },
        "pdi": {
            "Revisión PDI": "revisionPDI",
            "Historial PDI": "historialPDI",
            "Ajustes": "ajustes",
            "Contacto": "contacto"
        },
        "sag": {
            "Revisión SAG": "revisionSAG",
            "Historial SAG": "historialSAG",
            "Ajustes": "ajustes",
            "Contacto": "contacto"
        },
        "aduana": {
            "Resolución Final": "resolucionFinal",
            "Historial Aduana": "historialAduana",
            "Gestión General": "gestionGeneral",
            "Ajustes": "ajustes",
            "Contacto": "contacto"
        }
    };

    const seccionesDefault = {
        "usuario": "documentos",
        "pdi": "revisionPDI",
        "sag": "revisionSAG",
        "aduana": "resolucionFinal"
    };

    if (opciones[usuario]) {
        for (const [textoMenu, idSeccion] of Object.entries(opciones[usuario])) {
            const item = document.createElement("li");
            item.innerText = textoMenu;
            item.dataset.sectionId = idSeccion;

            item.addEventListener('click', () => {
                mostrarSeccion(idSeccion);
                if (idSeccion === 'estado-solicitud' && usuario === 'usuario') {
                    mostrarEstadoSolicitudUsuario();
                } else if (idSeccion === 'revisionSAG' && usuario === 'sag') {
                    mostrarDocumentosRevisionSAG();
                } else if (idSeccion === 'revisionPDI' && usuario === 'pdi') {
                    mostrarDocumentosRevisionPDI();
                } else if (idSeccion === 'resolucionFinal' && usuario === 'aduana') {
                    mostrarDocumentosRevisionAduana();
                }
            });
            menu.appendChild(item);
        }
    } else {
        menu.innerHTML = "<li>Error: Rol no reconocido</li>";
    }

    if (seccionesDefault[usuario]) {
        mostrarSeccion(seccionesDefault[usuario]);
        if (seccionesDefault[usuario] === 'estado-solicitud' && usuario === 'usuario') {
            mostrarEstadoSolicitudUsuario();
        } else if (seccionesDefault[usuario] === 'resolucionFinal' && usuario === 'aduana') {
            mostrarDocumentosRevisionAduana();
        }
    }
}

function mostrarSeccion(id) {
    const seccionesContenido = document.querySelectorAll('.content-section');
    seccionesContenido.forEach(sec => {
        sec.style.display = 'none';
    });

    const seccionAMostrar = document.getElementById(id);
    if (seccionAMostrar) {
        seccionAMostrar.style.display = 'block';
    } else {
        console.warn(`Sección con ID "${id}" no encontrada. Asegúrate de que existe en el HTML.`);
        document.getElementById("content").style.display = 'block';
    }
}

function cerrarSesion() {
    localStorage.removeItem("usuario");
    window.location.href = "index.html";
}

// Función auxiliar para simular la apertura/descarga del archivo
function abrirDocumento(fileName) {
    if (fileName && fileName !== 'N/A') {
        // En un sistema real, aquí harías una petición para descargar o abrir el archivo.
        // Por ahora, mostraremos una alerta con el nombre del archivo.
        alert(`Simulando apertura/descarga del archivo: ${fileName}`);
        // Si tuvieras URLs reales, podrías hacer:
        // window.open(`/ruta/a/tus/archivos/${fileName}`, '_blank');
    } else {
        alert("No hay un archivo disponible para abrir.");
    }
}


function getStatusClass(status) {
    status = status ? status.toLowerCase() : 'pendiente';
    switch (status) {
        case 'aprobado':
        case 'aprobado final':
            return 'status-approved';
        case 'rechazado':
        case 'rechazado final':
            return 'status-rejected';
        default:
            return 'status-pending';
    }
}

function mostrarEstadoSolicitudUsuario() {
    const lista = document.getElementById("listaEstadoSolicitud");
    if (!lista) return;

    lista.innerHTML = "";
    const documentos = JSON.parse(localStorage.getItem("documentos")) || [];

    if (documentos.length === 0) {
        lista.innerHTML = '<li>No hay solicitudes en curso.</li>';
        return;
    }

    documentos.forEach((doc) => {
        const item = document.createElement("li");
        item.innerHTML = `
            <h3>Solicitud de: ${doc.nombre} (RUT: ${doc.rut})</h3>
            <div class="status-item">
                <span class="status-label">Declaración SAG:</span>
                <span class="status-indicator ${getStatusClass(doc.estadoSAG)}">${doc.estadoSAG || 'Pendiente'}</span>
            </div>
            <div class="status-item">
                <span class="status-label">Elementos PDI:</span>
                <span class="status-indicator ${getStatusClass(doc.estadoPDI)}">${doc.estadoPDI || 'Pendiente'}</span>
            </div>
            <div class="status-item">
                <span class="status-label">Resolución Final:</span>
                <span class="status-indicator ${getStatusClass(doc.estadoAduana)}">${doc.estadoAduana || 'Pendiente'}</span>
            </div>
        `;
        lista.appendChild(item);
    });
}

function mostrarDocumentosRevisionSAG() {
    const lista = document.getElementById("listaSAG");
    if (!lista) return;

    lista.innerHTML = "";
    const documentos = JSON.parse(localStorage.getItem("documentos")) || [];

    const documentosPendientesSAG = documentos.filter(doc => doc.estadoSAG === "Pendiente");

    if (documentosPendientesSAG.length === 0) {
        lista.innerHTML = '<li>No hay documentos pendientes de revisión SAG.</li>';
        return;
    }

    documentosPendientesSAG.forEach((doc) => {
        const originalIndex = documentos.indexOf(doc);
        const item = document.createElement("li");
        const statusSAGClass = getStatusClass(doc.estadoSAG);

        item.innerHTML = `
            <h3>Solicitud de: ${doc.nombre} (RUT: ${doc.rut})</h3>
            <div class="status-item">
                <span class="status-label">Declaración SAG:</span>
                <span class="status-indicator ${statusSAGClass}">${doc.estadoSAG || "Pendiente"}</span>
            </div>
            <div class="status-item">
                <span class="status-label">Archivo:</span>
                <span>${doc.declaracion_sag || 'N/A'}</span>
                <button onclick="abrirDocumento('${doc.declaracion_sag}')">Abrir Archivo</button>
            </div>
            <div>
                <button class="aprobar" onclick="manejarAprobacionRechazo(${originalIndex}, 'estadoSAG', 'Aprobado', mostrarDocumentosRevisionSAG)">Aprobar</button>
                <button class="rechazar" onclick="manejarAprobacionRechazo(${originalIndex}, 'estadoSAG', 'Rechazado', mostrarDocumentosRevisionSAG)">Rechazar</button>
            </div>
        `;
        lista.appendChild(item);
    });
}

function mostrarDocumentosRevisionPDI() {
    const lista = document.getElementById("listaPDI");
    if (!lista) return;

    lista.innerHTML = "";
    const documentos = JSON.parse(localStorage.getItem("documentos")) || [];

    const documentosPendientesPDI = documentos.filter(doc => doc.estadoPDI === "Pendiente");

    if (documentosPendientesPDI.length === 0) {
        lista.innerHTML = '<li>No hay documentos pendientes de revisión PDI.</li>';
        return;
    }

    documentosPendientesPDI.forEach((doc) => {
        const originalIndex = documentos.indexOf(doc);
        const item = document.createElement("li");
        const statusPDIClass = getStatusClass(doc.estadoPDI);

        item.innerHTML = `
            <h3>Solicitud de: ${doc.nombre} (RUT: ${doc.rut})</h3>
            <div class="status-item">
                <span class="status-label">Elementos Prohibidos PDI:</span>
                <span class="status-indicator ${statusPDIClass}">${doc.estadoPDI || "Pendiente"}</span>
            </div>
            <div class="status-item">
                <span class="status-label">Archivo:</span>
                <span>${doc.elementos_pdi || 'N/A'}</span>
                <button onclick="abrirDocumento('${doc.elementos_pdi}')">Abrir Archivo</button>
            </div>
            <div>
                <button class="aprobar" onclick="manejarAprobacionRechazo(${originalIndex}, 'estadoPDI', 'Aprobado', mostrarDocumentosRevisionPDI)">Aprobar</button>
                <button class="rechazar" onclick="manejarAprobacionRechazo(${originalIndex}, 'estadoPDI', 'Rechazado', mostrarDocumentosRevisionPDI)">Rechazar</button>
            </div>
        `;
        lista.appendChild(item);
    });
}

function mostrarDocumentosRevisionAduana() {
    const lista = document.getElementById("listaAduana");
    if (!lista) return;

    lista.innerHTML = "";
    const documentos = JSON.parse(localStorage.getItem("documentos")) || [];

    const documentosParaAduana = documentos.filter(doc =>
        doc.estadoSAG === "Aprobado" &&
        doc.estadoPDI === "Aprobado" &&
        doc.estadoAduana === "Pendiente"
    );

    if (documentosParaAduana.length === 0) {
        lista.innerHTML = '<li>No hay solicitudes listas para resolución final de Aduana.</li>';
        return;
    }

    documentosParaAduana.forEach((doc) => {
        const originalIndex = documentos.indexOf(doc);
        const item = document.createElement("li");
        const statusAduanaClass = getStatusClass(doc.estadoAduana);

        item.innerHTML = `
            <h3>Solicitud de: ${doc.nombre} (RUT: ${doc.rut})</h3>
            <div class="status-item">
                <span class="status-label">Estado SAG:</span>
                <span class="status-indicator ${getStatusClass(doc.estadoSAG)}">${doc.estadoSAG || 'Pendiente'}</span>
            </div>
            <div class="status-item">
                <span class="status-label">Archivo SAG:</span>
                <span>${doc.declaracion_sag || 'N/A'}</span>
                <button onclick="abrirDocumento('${doc.declaracion_sag}')">Abrir Archivo</button>
            </div>
            <div class="status-item">
                <span class="status-label">Estado PDI:</span>
                <span class="status-indicator ${getStatusClass(doc.estadoPDI)}">${doc.estadoPDI || 'Pendiente'}</span>
            </div>
            <div class="status-item">
                <span class="status-label">Archivo PDI:</span>
                <span>${doc.elementos_pdi || 'N/A'}</span>
                <button onclick="abrirDocumento('${doc.elementos_pdi}')">Abrir Archivo</button>
            </div>
            <div class="status-item">
                <span class="status-label">Resolución Final:</span>
                <span class="status-indicator ${statusAduanaClass}">${doc.estadoAduana || 'Pendiente'}</span>
            </div>
            <div>
                <button class="aprobarFinal" onclick="manejarAprobacionRechazo(${originalIndex}, 'estadoAduana', 'Aprobado Final', mostrarDocumentosRevisionAduana)">Aprobar Entrada</button>
                <button class="rechazarFinal" onclick="manejarAprobacionRechazo(${originalIndex}, 'estadoAduana', 'Rechazado Final', mostrarDocumentosRevisionAduana)">Rechazar Entrada</button>
            </div>
        `;
        lista.appendChild(item);
    });
}

function manejarAprobacionRechazo(index, campoEstado, nuevoEstado, funcionActualizarVista) {
    let documentos = JSON.parse(localStorage.getItem("documentos")) || [];
    documentos[index][campoEstado] = nuevoEstado;

    if (campoEstado === 'estadoAduana') {
        documentos[index].estado = nuevoEstado;
    }

    localStorage.setItem("documentos", JSON.stringify(documentos));
    alert(`Documento de ${documentos[index].nombre} ${nuevoEstado} por ${campoEstado.replace('estado', '')}.`);
    funcionActualizarVista();
    if (localStorage.getItem("usuario") === "usuario" && typeof mostrarEstadoSolicitudUsuario === 'function') {
        mostrarEstadoSolicitudUsuario();
    }
}