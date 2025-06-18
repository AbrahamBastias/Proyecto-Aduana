// dashboard.js
document.addEventListener("DOMContentLoaded", function () {
    const usuario = localStorage.getItem("usuario");

    if (!usuario) {
        window.location.href = "index.html"; // Redirige al login si no hay usuario
        return;
    }

    document.getElementById("userName").innerText = usuario;
    construirMenu(usuario);
    aplicarModoOscuroGuardado(); // Aplicar modo oscuro al cargar
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
            "Historial PDI": "historialPDI", // Añadido aquí
            "Ajustes": "ajustes",
            "Contacto": "contacto"
        },
        "sag": {
            "Revisión SAG": "revisionSAG",
            "Historial SAG": "historialSAG", // Añadido aquí
            "Ajustes": "ajustes",
            "Contacto": "contacto"
        },
        "aduana": {
            "Resolución Final": "resolucionFinal",
            "Historial Aduana": "historialAduana", // Añadido aquí
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
                } else if (idSeccion === 'historialSAG' && usuario === 'sag') { // Llamada a la función de historial
                    mostrarHistorialSAG();
                } else if (idSeccion === 'revisionPDI' && usuario === 'pdi') {
                    mostrarDocumentosRevisionPDI();
                } else if (idSeccion === 'historialPDI' && usuario === 'pdi') { // Llamada a la función de historial
                    mostrarHistorialPDI();
                } else if (idSeccion === 'resolucionFinal' && usuario === 'aduana') {
                    mostrarDocumentosRevisionAduana();
                } else if (idSeccion === 'historialAduana' && usuario === 'aduana') { // Llamada a la función de historial
                    mostrarHistorialAduana();
                } else if (idSeccion === 'ajustes') { // Cargar settings al abrir ajustes
                    cargarAjustesUsuario();
                }
            });
            menu.appendChild(item);
        }
    } else {
        menu.innerHTML = "<li>Error: Rol no reconocido</li>";
    }

    // Muestra la sección por defecto al cargar la página
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

function abrirDocumento(fileName) {
    if (fileName && fileName !== 'N/A' && fileName !== 'undefined') { // Added undefined check
        alert(`Simulando apertura/descarga del archivo: ${fileName}`);
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
            <div class="user-info-section">
                <p><strong>Email:</strong> ${doc.correo}</p>
                <p><strong>Dirección:</strong> ${doc.direccion}</p>
                <p><strong>Teléfono:</strong> ${doc.telefono}</p>
                <p><strong>Fecha Nacimiento:</strong> ${doc.fecha_nacimiento}</p>
                <p><strong>Comentarios:</strong> ${doc.comentarios || 'N/A'}</p>
            </div>
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
            <div class="user-info-section">
                <p><strong>Email:</strong> ${doc.correo}</p>
                <p><strong>Dirección:</strong> ${doc.direccion}</p>
                <p><strong>Teléfono:</strong> ${doc.telefono}</p>
                <p><strong>Fecha Nacimiento:</strong> ${doc.fecha_nacimiento}</p>
                <p><strong>Comentarios:</strong> ${doc.comentarios || 'N/A'}</p>
            </div>
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
            <div class="user-info-section">
                <p><strong>Email:</strong> ${doc.correo}</p>
                <p><strong>Dirección:</strong> ${doc.direccion}</p>
                <p><strong>Teléfono:</strong> ${doc.telefono}</p>
                <p><strong>Fecha Nacimiento:</strong> ${doc.fecha_nacimiento}</p>
                <p><strong>Comentarios:</strong> ${doc.comentarios || 'N/A'}</p>
            </div>
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
    // Después de una acción, es bueno recargar la vista del usuario para que vea el cambio
    if (localStorage.getItem("usuario") === "usuario" && typeof mostrarEstadoSolicitudUsuario === 'function') {
        mostrarEstadoSolicitudUsuario();
    }
}

// --- NUEVAS FUNCIONES DE HISTORIAL ---

function mostrarHistorialPDI() {
    const lista = document.getElementById("historialPDI");
    if (!lista) return;

    lista.innerHTML = "";
    const documentos = JSON.parse(localStorage.getItem("documentos")) || [];

    // Filtra documentos donde PDI ya ha tomado una decisión (Aprobado o Rechazado)
    const documentosRevisadosPDI = documentos.filter(doc =>
        doc.estadoPDI === "Aprobado" || doc.estadoPDI === "Rechazado"
    );

    if (documentosRevisadosPDI.length === 0) {
        lista.innerHTML = '<li>No hay documentos en el historial de revisión PDI.</li>';
        return;
    }

    documentosRevisadosPDI.forEach((doc) => {
        const item = document.createElement("li");
        const statusPDIClass = getStatusClass(doc.estadoPDI);

        item.innerHTML = `
            <h3>Solicitud de: ${doc.nombre} (RUT: ${doc.rut})</h3>
            <div class="user-info-section">
                <p><strong>Email:</strong> ${doc.correo}</p>
                <p><strong>Dirección:</strong> ${doc.direccion}</p>
                <p><strong>Teléfono:</strong> ${doc.telefono}</p>
                <p><strong>Fecha Nacimiento:</strong> ${doc.fecha_nacimiento}</p>
                <p><strong>Comentarios:</strong> ${doc.comentarios || 'N/A'}</p>
            </div>
            <div class="status-item">
                <span class="status-label">Elementos Prohibidos PDI:</span>
                <span class="status-indicator ${statusPDIClass}">${doc.estadoPDI || "Pendiente"}</span>
            </div>
            <div class="status-item">
                <span class="status-label">Archivo:</span>
                <span>${doc.elementos_pdi || 'N/A'}</span>
                <button onclick="abrirDocumento('${doc.elementos_pdi}')">Abrir Archivo</button>
            </div>
            <p>Estado Final Aduana: <span class="${getStatusClass(doc.estadoAduana)}">${doc.estadoAduana || 'Pendiente'}</span></p>
        `;
        lista.appendChild(item);
    });
}

function mostrarHistorialSAG() {
    const lista = document.getElementById("historialSAG");
    if (!lista) return;

    lista.innerHTML = "";
    const documentos = JSON.parse(localStorage.getItem("documentos")) || [];

    // Filtra documentos donde SAG ya ha tomado una decisión (Aprobado o Rechazado)
    const documentosRevisadosSAG = documentos.filter(doc =>
        doc.estadoSAG === "Aprobado" || doc.estadoSAG === "Rechazado"
    );

    if (documentosRevisadosSAG.length === 0) {
        lista.innerHTML = '<li>No hay documentos en el historial de revisión SAG.</li>';
        return;
    }

    documentosRevisadosSAG.forEach((doc) => {
        const item = document.createElement("li");
        const statusSAGClass = getStatusClass(doc.estadoSAG);

        item.innerHTML = `
            <h3>Solicitud de: ${doc.nombre} (RUT: ${doc.rut})</h3>
            <div class="user-info-section">
                <p><strong>Email:</strong> ${doc.correo}</p>
                <p><strong>Dirección:</strong> ${doc.direccion}</p>
                <p><strong>Teléfono:</strong> ${doc.telefono}</p>
                <p><strong>Fecha Nacimiento:</strong> ${doc.fecha_nacimiento}</p>
                <p><strong>Comentarios:</strong> ${doc.comentarios || 'N/A'}</p>
            </div>
            <div class="status-item">
                <span class="status-label">Declaración SAG:</span>
                <span class="status-indicator ${statusSAGClass}">${doc.estadoSAG || "Pendiente"}</span>
            </div>
            <div class="status-item">
                <span class="status-label">Archivo:</span>
                <span>${doc.declaracion_sag || 'N/A'}</span>
                <button onclick="abrirDocumento('${doc.declaracion_sag}')">Abrir Archivo</button>
            </div>
            <p>Estado Final Aduana: <span class="${getStatusClass(doc.estadoAduana)}">${doc.estadoAduana || 'Pendiente'}</span></p>
        `;
        lista.appendChild(item);
    });
}

function mostrarHistorialAduana() {
    const lista = document.getElementById("historialAduana");
    if (!lista) return;

    lista.innerHTML = "";
    const documentos = JSON.parse(localStorage.getItem("documentos")) || [];

    // Filtra documentos donde Aduana ya ha tomado una decisión (Aprobado Final o Rechazado Final)
    const documentosRevisadosAduana = documentos.filter(doc =>
        doc.estadoAduana === "Aprobado Final" || doc.estadoAduana === "Rechazado Final"
    );

    if (documentosRevisadosAduana.length === 0) {
        lista.innerHTML = '<li>No hay documentos en el historial de resolución de Aduana.</li>';
        return;
    }

    documentosRevisadosAduana.forEach((doc) => {
        const item = document.createElement("li");
        const statusAduanaClass = getStatusClass(doc.estadoAduana);

        item.innerHTML = `
            <h3>Solicitud de: ${doc.nombre} (RUT: ${doc.rut})</h3>
            <div class="user-info-section">
                <p><strong>Email:</strong> ${doc.correo}</p>
                <p><strong>Dirección:</strong> ${doc.direccion}</p>
                <p><strong>Teléfono:</strong> ${doc.telefono}</p>
                <p><strong>Fecha Nacimiento:</strong> ${doc.fecha_nacimiento}</p>
                <p><strong>Comentarios:</strong> ${doc.comentarios || 'N/A'}</p>
            </div>
            <div class="status-item">
                <span class="status-label">Resolución Final:</span>
                <span class="status-indicator ${statusAduanaClass}">${doc.estadoAduana || 'Pendiente'}</span>
            </div>
            <p>Estado SAG: <span class="${getStatusClass(doc.estadoSAG)}">${doc.estadoSAG || 'Pendiente'}</span></p>
            <p>Estado PDI: <span class="${getStatusClass(doc.estadoPDI)}">${doc.estadoPDI || 'Pendiente'}</span></p>
        `;
        lista.appendChild(item);
    });
}

// --- Funciones de ajustes (modo oscuro, email, contraseña) ---
const USERS_KEY = "usuariosRegistrados"; // Definir la clave para los usuarios

function aplicarModoOscuroGuardado() {
    const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', darkModeEnabled);
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.checked = darkModeEnabled;
    }
}

function cargarAjustesUsuario() {
    const currentEmailInput = document.getElementById('currentEmail');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const usuarioActual = localStorage.getItem('usuario'); // Obtener el nombre de usuario del localStorage

    if (usuarioActual && currentEmailInput) {
        let usuarios = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
        let usuarioData = usuarios.find(u => u.username === usuarioActual);

        if (usuarioData) {
            currentEmailInput.value = usuarioData.email || '';
        }
    }

    if (darkModeToggle) {
        darkModeToggle.checked = localStorage.getItem('darkMode') === 'true';
        darkModeToggle.onchange = function () {
            document.body.classList.toggle('dark-mode', this.checked);
            localStorage.setItem('darkMode', this.checked);
        };
    }

    // Event listener para actualizar email
    const updateContactForm = document.getElementById('updateContactForm');
    if (updateContactForm) {
        updateContactForm.onsubmit = function (event) {
            event.preventDefault();
            const newEmail = document.getElementById('newEmail').value;
            if (!newEmail) {
                alert("Por favor, ingresa un nuevo email.");
                return;
            }

            if (usuarioActual) {
                let usuarios = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
                let usuarioIndex = usuarios.findIndex(u => u.username === usuarioActual);

                if (usuarioIndex !== -1) {
                    usuarios[usuarioIndex].email = newEmail;
                    localStorage.setItem(USERS_KEY, JSON.stringify(usuarios));
                    alert("Email actualizado con éxito.");
                    document.getElementById('currentEmail').value = newEmail; // Actualizar el campo deshabilitado
                    document.getElementById('newEmail').value = ''; // Limpiar campo
                } else {
                    alert("Error: Usuario no encontrado para actualizar el email.");
                }
            }
        };
    }

    // Event listener para cambiar contraseña
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.onsubmit = function (event) {
            event.preventDefault();
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmNewPassword = document.getElementById('confirmNewPassword').value;

            if (!currentPassword || !newPassword || !confirmNewPassword) {
                alert("Por favor, rellena todos los campos de contraseña.");
                return;
            }

            if (newPassword !== confirmNewPassword) {
                alert("La nueva contraseña y la confirmación no coinciden.");
                return;
            }

            if (usuarioActual) {
                let usuarios = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
                let usuarioIndex = usuarios.findIndex(u => u.username === usuarioActual);

                if (usuarioIndex !== -1) {
                    // En una app real, aquí verificarías la contraseña actual con un hash seguro
                    if (usuarios[usuarioIndex].password === currentPassword) { // Simulación
                        usuarios[usuarioIndex].password = newPassword;
                        localStorage.setItem(USERS_KEY, JSON.stringify(usuarios));
                        alert("Contraseña actualizada con éxito.");
                        // Limpiar campos
                        document.getElementById('currentPassword').value = '';
                        document.getElementById('newPassword').value = '';
                        document.getElementById('confirmNewPassword').value = '';
                    } else {
                        alert("La contraseña actual es incorrecta.");
                    }
                } else {
                    alert("Error: Usuario no encontrado para cambiar la contraseña.");
                }
            }
        };
    }
}