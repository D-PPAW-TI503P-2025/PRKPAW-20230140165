// controllers/iotController.js

const { SensorLog } = require('../models');

// Fungsi LAMA (ping test) - biarkan tetap ada
exports.testConnection = (req, res) => {
  const { message, deviceId } = req.body;
  console.log(`📡 [IOT] Pesan dari ${deviceId}: ${message}`);
  res.status(200).json({ status: "ok", reply: "Server menerima koneksi!" });
};

exports.getSensorHistory = async (req, res) => {
  try {
    const data = await SensorLog.findAll({
      limit: 20,
      order: [['createdAt', 'DESC']]
    });

    const formattedData = data.reverse(); 

    res.json({
      status: "success",
      data: formattedData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ TAMBAHKAN FUNGSI INI UNTUK FRONTEND
exports.getLatestSensorData = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    
    const data = await SensorLog.findAll({
      limit: limit,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'suhu', 'kelembaban', 'cahaya', 'createdAt', 'updatedAt']
    });
    
    console.log(`✅ Sensor data found: ${data.length} items`);
    
    // Return langsung array (tanpa wrapper "data")
    res.json(data);
    
  } catch (error) {
    console.error('❌ Error fetching sensor data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch sensor data',
      message: error.message 
    });
  }
};

// Fungsi BARU (simpan ke database)
exports.receiveSensorData = async (req, res) => {
  try {
    const { suhu, kelembaban, cahaya } = req.body;
    
    if (suhu === undefined || kelembaban === undefined) {
      return res.status(400).json({
        status: "error",
        message: "Data suhu atau kelembaban tidak valid"
      });
    }
    
    const newData = await SensorLog.create({
      suhu: parseFloat(suhu),
      kelembaban: parseFloat(kelembaban),
      cahaya: parseInt(cahaya) || 0
    });
    
    console.log(`💾 [SAVED] Suhu: ${suhu}°C | Lembab: ${kelembaban}% | Cahaya: ${cahaya}`);
    
    res.status(201).json({ 
      status: "ok", 
      message: "Data berhasil disimpan",
      data: newData
    });
    
  } catch (error) {
    console.error("❌ Gagal menyimpan data:", error);
    res.status(500).json({ 
      status: "error", 
      message: error.message 
    });
  }
};