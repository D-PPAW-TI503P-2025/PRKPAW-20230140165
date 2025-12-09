const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// [FIX KRITIS] Import handlers secara destructuring dari controller
const {
    checkIn,
    checkOut,
    updatePresensi,
    deletePresensi,
    dailyReport,
    upload // <--- AMBIL MIDDLEWARE UPLOAD
} = require('../controllers/presensiController');

const { authenticateToken, isAdmin } = require('../middleware/permissionMiddleware');

const validatePresensiUpdate = [
    body('checkIn').optional().isISO8601().withMessage('Format checkIn harus berupa tanggal/waktu ISO 8601 yang valid.'),
    body('checkOut').optional().isISO8601().withMessage('Format checkOut harus berupa tanggal/waktu ISO 8601 yang valid.'),
];

// Rute Presensi (Memerlukan Login JWT)
// [FIX MODUL 10] Gunakan 'upload' yang diimpor secara destructuring
router.post('/check-in',
    authenticateToken,
    upload.single('image'), // <--- Gunakan 'upload' langsung
    checkIn);              // <--- Gunakan 'checkIn' langsung

router.post('/check-out', authenticateToken, checkOut);

// Rute Laporan Admin
router.get('/reports/daily', authenticateToken, isAdmin, dailyReport);

// Rute Update & Delete (Memerlukan Login JWT)
router.put('/:id', authenticateToken, validatePresensiUpdate, updatePresensi);
router.delete('/:id', authenticateToken, deletePresensi);

module.exports = router;