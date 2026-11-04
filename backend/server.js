require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// CONEXIÓN A POSTGRESQL (RENDER)
// ==========================================

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// ==========================================
// MIDDLEWARES
// ==========================================

app.use(cors());
app.use(express.json());

// ==========================================
// CREAR TABLA SI NO EXISTE
// ==========================================

async function crearTabla() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS mediciones (
            id SERIAL PRIMARY KEY,
            voltage_real_entrada DOUBLE PRECISION,
            voltage_bus_entrada DOUBLE PRECISION,
            voltage_shunt_entrada DOUBLE PRECISION,
            corriente_entrada DOUBLE PRECISION,
            potencia_entrada DOUBLE PRECISION,
            voltage_real_salida DOUBLE PRECISION,
            voltage_bus_salida DOUBLE PRECISION,
            voltage_shunt_salida DOUBLE PRECISION,
            corriente_salida DOUBLE PRECISION,
            potencia_salida DOUBLE PRECISION,
            fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    console.log("Tabla mediciones lista");
}

// ==========================================
// RUTA PRINCIPAL
// ==========================================

app.get("/", (req, res) => {
    res.json({
        mensaje: "API del proyecto ESP32 funcionando"
    });
});

// ==========================================
// RECIBIR Y GUARDAR DATOS DEL ESP32
// ==========================================

app.post("/api/mediciones", async (req, res) => {

    try {
        console.log("Datos recibidos:", req.body);

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: "No se recibieron datos"
            });
        }

        const m = req.body;

        await pool.query(`
            INSERT INTO mediciones (
                voltage_real_entrada,
                voltage_bus_entrada,
                voltage_shunt_entrada,
                corriente_entrada,
                potencia_entrada,
                voltage_real_salida,
                voltage_bus_salida,
                voltage_shunt_salida,
                corriente_salida,
                potencia_salida
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        `, [
            m.voltage_real_entrada ?? 0,
            m.voltage_bus_entrada ?? 0,
            m.voltage_shunt_entrada ?? 0,
            m.corriente_entrada ?? 0,
            m.potencia_entrada ?? 0,
            m.voltage_real_salida ?? 0,
            m.voltage_bus_salida ?? 0,
            m.voltage_shunt_salida ?? 0,
            m.corriente_salida ?? 0,
            m.potencia_salida ?? 0
        ]);

        res.status(200).json({
            mensaje: "Mediciones guardadas correctamente"
        });

    } catch (error) {
        console.error("Error guardando mediciones:", error);

        res.status(500).json({
            error: "Error al guardar en PostgreSQL"
        });
    }
});

// ==========================================
// OBTENER ÚLTIMA MEDICIÓN
// ==========================================

app.get("/api/mediciones", async (req, res) => {

    try {
        const resultado = await pool.query(`
            SELECT * FROM mediciones
            ORDER BY id DESC
            LIMIT 1
        `);

        res.json(resultado.rows[0] || {});

    } catch (error) {
        console.error("Error consultando mediciones:", error);

        res.status(500).json({
            error: "Error al consultar PostgreSQL"
        });
    }
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================

async function iniciarServidor() {
    try {
        await crearTabla();

        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
            console.log("Conectado a PostgreSQL");
        });

    } catch (error) {
        console.error("Error iniciando servidor:", error);
        process.exit(1);
    }
}

iniciarServidor();