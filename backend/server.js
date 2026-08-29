const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());


// ==========================================
// DATOS DE LA ÚLTIMA MEDICIÓN
// ==========================================

let mediciones = {
    voltage_real_entrada: 0,
    voltage_bus_entrada: 0,
    voltage_shunt_entrada: 0,
    corriente_entrada: 0,
    potencia_entrada: 0,

    voltage_real_salida: 0,
    voltage_bus_salida: 0,
    voltage_shunt_salida: 0,
    corriente_salida: 0,
    potencia_salida: 0
};


// ==========================================
// RUTA PRINCIPAL
// ==========================================

app.get("/", (req, res) => {

    res.json({
        mensaje: "API del proyecto ESP32 funcionando"
    });

});


// ==========================================
// RECIBIR DATOS DEL ESP32
// ==========================================

app.post("/api/mediciones", (req, res) => {

    mediciones = req.body;

    console.log("Nueva medición recibida:");
    console.log(mediciones);

    res.json({
        mensaje: "Medición recibida correctamente",
        datos: mediciones
    });

});


// ==========================================
// OBTENER DATOS
// ==========================================

app.get("/api/mediciones", (req, res) => {

    res.json(mediciones);

});


// ==========================================
// INICIAR SERVIDOR
// ==========================================

app.listen(PORT, () => {

    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);

});