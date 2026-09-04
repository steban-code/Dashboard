const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

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
    console.log("Datos recibidos:", req.body);

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            error: "No se recibieron datos"
        });
    }

    mediciones = req.body;

    res.status(200).json({
        mensaje: "Datos recibidos correctamente",
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