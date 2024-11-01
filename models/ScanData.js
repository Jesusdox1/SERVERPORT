// models/ScanData.js
const mongoose = require('mongoose');

const scanDataSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  puertos_abiertos: { type: [Number], required: true },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ScanData', scanDataSchema);
