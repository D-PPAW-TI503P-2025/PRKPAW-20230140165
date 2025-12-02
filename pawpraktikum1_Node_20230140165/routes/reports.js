// routes/reports.js

const express = require('express');
const router = express.Router();
// Pastikan presensiController diimpor dengan benar
const presensiController = require('../controllers/presensiController'); 
const { authenticateToken, isAdmin } = require('../middleware/permissionMiddleware');

// Route Laporan yang menangani endpoint /daily
router.get('/daily', authenticateToken, isAdmin, presensiController.dailyReport); 

module.exports = router;