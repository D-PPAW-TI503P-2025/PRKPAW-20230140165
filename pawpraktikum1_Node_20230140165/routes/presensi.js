const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { authenticateToken, isAdmin } = require('../middleware/permissionMiddleware');
const { body, validationResult } = require('express-validator');
const Presensi = require('../models').Presensi;
const { dailyReport } = require('../controllers/presensiController');

const validatePresensiUpdate = [
    body('checkIn').optional().isISO8601().withMessage('Format checkIn harus berupa tanggal/waktu ISO 8601 yang valid.'),
    body('checkOut').optional().isISO8601().withMessage('Format checkOut harus berupa tanggal/waktu ISO 8601 yang valid.'),
];

// Rute Presensi (Memerlukan Login JWT)
router.post('/check-in', authenticateToken, presensiController.checkIn);
router.post('/check-out', authenticateToken, presensiController.checkOut);

// Rute Laporan DIHAPUS DARI SINI, SUDAH ADA DI routes/reports.js
router.get('/reports/daily', authenticateToken, isAdmin, presensiController.dailyReport);

// Rute Update & Delete (Memerlukan Login JWT)
router.put('/:id', authenticateToken, validatePresensiUpdate, presensiController.updatePresensi);
router.delete('/:id', authenticateToken, presensiController.deletePresensi);

module.exports = router;