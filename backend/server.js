
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

// CONEXION POSTGRESQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    connectionTimeoutMillis: 10000
});

pool.on("error", (error) => {
    console.error("Error PostgreSQL:", error.message);
});

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// CREAR TABLA
async function crearTabla() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS mediciones (
            id SERIAL PRIMARY KEY,
            voltage_e DOUBLE PRECISION,
            corriente_e DOUBLE PRECISION,
            potencia_e DOUBLE PRECISION,
            voltage_s DOUBLE PRECISION,
            corriente_s DOUBLE PRECISION,
            potencia_s DOUBLE PRECISION,
            fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    console.log("Tabla mediciones lista");
}

// RUTA PRINCIPAL
app.get("/", (req, res) => {
    res.json({
        mensaje: "API ESP32 funcionando"
    });
});

// RECIBIR MEDICIONES DEL ESP32
app.post("/api/mediciones", async (req, res) => {
    try {
        console.log("Datos recibidos:", req.body);

        const {
            voltage_e,
            corriente_e,
            potencia_e,
            voltage_s,
            corriente_s,
            potencia_s
        } = req.body;

        const valores = [
            voltage_e,
            corriente_e,
            potencia_e,
            voltage_s,
            corriente_s,
            potencia_s
        ];

        const validos = valores.every(
            valor =>
                valor !== undefined &&
                valor !== null &&
                Number.isFinite(Number(valor))
        );

        if (!validos) {
            return res.status(400).json({
                error: "Datos incompletos o inválidos"
            });
        }

        // GUARDAR EN POSTGRESQL
        await pool.query(`
            INSERT INTO mediciones (
                voltage_e,
                corriente_e,
                potencia_e,
                voltage_s,
                corriente_s,
                potencia_s
            )
            VALUES ($1, $2, $3, $4, $5, $6)
        `, valores.map(Number));

        console.log("Mediciones guardadas en PostgreSQL");

        res.status(200).json({
            mensaje: "Mediciones recibidas y guardadas correctamente"
        });

    } catch (error) {
        console.error("Error guardando mediciones:", error);

        res.status(500).json({
            error: "Error al guardar en PostgreSQL"
        });
    }
});

// CONSULTAR ULTIMA MEDICION
app.get("/api/mediciones", async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT *
            FROM mediciones
            ORDER BY id DESC
            LIMIT 1
        `);

        res.json(resultado.rows[0] || {});

    } catch (error) {
        console.error("Error consultando:", error);

        res.status(500).json({
            error: "Error al consultar PostgreSQL"
        });
    }
});

// INICIAR SERVIDOR
async function iniciarServidor() {
    try {
        await crearTabla();

        app.listen(PORT, "0.0.0.0", () => {
            console.log("Servidor ejecutándose en puerto " + PORT);
            console.log("PostgreSQL conectado");
        });

    } catch (error) {
        console.error("Error iniciando servidor:", error);
        process.exit(1);
    }
}

iniciarServidor();
