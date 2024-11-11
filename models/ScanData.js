// models/ScanData.js
const mongoose = require('mongoose');

const scanDataSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  puertos_abiertos: { type: [String], required: true },  // Cambiado a String para almacenar IPs
  exploits_realizados: [
    {
      puerto: { type: Number },
      resultado: { type: String }
    }
  ],
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ScanData', scanDataSchema);
