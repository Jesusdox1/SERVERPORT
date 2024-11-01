// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const ScanData = require('./models/ScanData');

const app = express();
app.use(express.json()); // Middleware para analizar JSON

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' https://vercel.live; img-src 'self' data: https://*; connect-src 'self' https://vercel.live");
    next();
});


// Conectar a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error al conectar a MongoDB Atlas:', err));

// Ruta para recibir y almacenar los datos de escaneo de puertos
app.post('/api/puertos', async (req, res) => {
    const { ip, puertos_abiertos } = req.body;
  try {
    const nuevoEscaneo = new ScanData({ ip, puertos_abiertos });
    await nuevoEscaneo.save();
    res.status(201).json({ mensaje: 'Datos guardados exitosamente', datos: nuevoEscaneo });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al guardar datos', error });
  }
});

// Ruta para obtener todos los datos de escaneo
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
