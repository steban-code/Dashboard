
const API = "/api/mediciones";

async function obtenerMediciones() {
    const estado = document.getElementById("estado");
    const indicador = document.getElementById("indicador");

    try {
        const respuesta = await fetch(API, { cache: "no-store" });

        if (!respuesta.ok) {
            throw new Error("Error HTTP " + respuesta.status);
        }

        const datos = await respuesta.json();

        const variables = [
            "voltage_e",
            "corriente_e",
            "potencia_e",
            "voltage_s",
            "corriente_s",
            "potencia_s"
        ];

        variables.forEach(variable => {
            document.getElementById(variable).textContent =
                Number(datos[variable]).toFixed(2);
        });

        estado.textContent = "Conexión activa";
        indicador.style.background = "#35c875";

        document.getElementById("actualizacion").textContent =
            "Consulta: " + new Date().toLocaleTimeString();

        document.getElementById("fecha").textContent =
            "Último registro: " +
            (datos.fecha
                ? new Date(datos.fecha).toLocaleString()
                : "Sin fecha");

    } catch (error) {
        estado.textContent = "Error de conexión";
        indicador.style.background = "#e05252";

        console.error("Error consultando mediciones:", error);
    }
}

obtenerMediciones();
setInterval(obtenerMediciones, 2000);
