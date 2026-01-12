// routes/iot.js

const express = require('express');
const router = express.Router();
const iotController = require('../controllers/iotController');

// ✅ TAMBAHKAN ROUTE INI (untuk frontend grafik)
router.get('/latest', iotController.getLatestSensorData);

// Route yang sudah ada
router.get('/history', iotController.getSensorHistory);

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/ping', iotController.testConnection);
router.post('/data', iotController.receiveSensorData);

module.exports = router;