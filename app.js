
// ==========================================
// CONFIGURACIÓN DE LA API
// ==========================================

const API_URL = "https://dashboard-rjuc.onrender.com/api/mediciones";

// ==========================================
// CONSULTAR MEDICIONES
// ==========================================

async function obtenerMediciones() {

    const estado = document.getElementById("estadoConexion");

    try {

        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error("Error al consultar la API");
        }

        const datos = await respuesta.json();

        // Comprobar si existen mediciones
        if (!datos || !datos.id) {
            estado.textContent = "Esperando mediciones del ESP32";
            return;
        }

        // ==========================================
        // DATOS DE ENTRADA
        // ==========================================

        document.getElementById("voltajeEntrada").textContent =
            `${Number(datos.voltage_real_entrada).toFixed(2)} V`;

        document.getElementById("corrienteEntrada").textContent =
            `${Number(datos.corriente_entrada).toFixed(2)} mA`;

        document.getElementById("potenciaEntrada").textContent =
            `${Number(datos.potencia_entrada).toFixed(2)} mW`;

        // ==========================================
        // DATOS DE SALIDA
        // ==========================================

        document.getElementById("voltajeSalida").textContent =
            `${Number(datos.voltage_real_salida).toFixed(2)} V`;

        document.getElementById("corrienteSalida").textContent =
            `${Number(datos.corriente_salida).toFixed(2)} mA`;

        document.getElementById("potenciaSalida").textContent =
            `${Number(datos.potencia_salida).toFixed(2)} mW`;

        // ==========================================
        // ESTADO DE CONEXIÓN
        // ==========================================

        estado.textContent = "API conectada · Mediciones recibidas";

        console.log("Mediciones actualizadas:", datos);

    } catch (error) {

        console.error("Error obteniendo mediciones:", error);

        estado.textContent = "Error de conexión con la API";

    }

}

// ==========================================
// ACTUALIZACIÓN AUTOMÁTICA
// ==========================================

// Primera consulta
obtenerMediciones();

// Consultar cada 2 segundos
setInterval(obtenerMediciones, 2000);
