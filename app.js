// ==========================================
// DATOS SIMULADOS DEL ESP32
// ==========================================

function generarDatos() {

    // Datos de entrada
    const voltajeEntrada = (12 + Math.random() * 2).toFixed(2);
    const corrienteEntrada = (500 + Math.random() * 300).toFixed(2);

    const potenciaEntrada =
        (voltajeEntrada * corrienteEntrada).toFixed(2);


    // Datos de salida
    const voltajeSalida = (5 + Math.random() * 1).toFixed(2);
    const corrienteSalida = (300 + Math.random() * 200).toFixed(2);

    const potenciaSalida =
        (voltajeSalida * corrienteSalida).toFixed(2);


    // ==========================================
    // MOSTRAR DATOS EN EL DASHBOARD
    // ==========================================

    document.getElementById("voltajeEntrada").textContent =
        `${voltajeEntrada} V`;

    document.getElementById("corrienteEntrada").textContent =
        `${corrienteEntrada} mA`;

    document.getElementById("potenciaEntrada").textContent =
        `${potenciaEntrada} mW`;


    document.getElementById("voltajeSalida").textContent =
        `${voltajeSalida} V`;

    document.getElementById("corrienteSalida").textContent =
        `${corrienteSalida} mA`;

    document.getElementById("potenciaSalida").textContent =
        `${potenciaSalida} mW`;


    // ==========================================
    // ESTADO DE CONEXIÓN
    // ==========================================

    document.getElementById("estadoConexion").textContent =
        "ESP32 conectado";

}


// Ejecutar inmediatamente
generarDatos();


// Actualizar cada 2 segundos
setInterval(generarDatos, 2000);