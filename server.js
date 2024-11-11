// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const ScanData = require('./models/ScanData');

const app = express();
app.use(express.json());

// Configuración de la política de seguridad con CSP
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' https://vercel.live; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*; connect-src 'self' https://vercel.live; frame-src 'self' https://vercel.live");
    next();
});

// Conectar a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch(err => console.error('Error al conectar a MongoDB Atlas:', err));

// Ruta para la raíz del servidor, muestra IPs escaneadas con detalles de los exploits
app.get('/', async (req, res) => {
    try {
        const datos = await ScanData.find();
        let html = '<h1>Bienvenido al Servidor de Escaneo de Puertos</h1>';
        html += '<h2>Datos de IPs Escaneadas:</h2><ul>';
        datos.forEach(item => {
            html += `<li><strong>IP:</strong> ${item.ip} - <strong>Puertos Abiertos:</strong> ${item.puertos_abiertos.join(', ')} - <strong>Fecha:</strong> ${new Date(item.fecha).toLocaleString()}`;
            if (item.exploits_realizados && item.exploits_realizados.length > 0) {
                html += '<ul><strong>Exploits Realizados:</strong>';
                item.exploits_realizados.forEach(exploit => {
                    html += `<li>Puerto ${exploit.puerto}: ${exploit.resultado}</li>`;
                });
                html += '</ul>';
            }
            html += '</li>';
        });
        html += '</ul>';
        res.send(html);
    } catch (error) {
        res.status(500).send('<h1>Error al cargar los datos</h1>');
    }
});

// Ruta para recibir y almacenar los datos de escaneo y exploits
app.post('/api/puertos', async (req, res) => {
    const { ip, puertos_abiertos, exploits_realizados } = req.body;
    try {
        const nuevoEscaneo = new ScanData({ ip, puertos_abiertos, exploits_realizados });
        await nuevoEscaneo.save();
        res.status(201).json({ mensaje: 'Datos guardados exitosamente', datos: nuevoEscaneo });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al guardar datos', error });
    }
});

// Ruta para obtener todos los datos de escaneo en formato JSON
app.get('/api/puertos', async (req, res) => {
    try {
        const datos = await ScanData.find();
        res.status(200).json(datos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener datos', error });
    }
});

// Inicia el servidor
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

