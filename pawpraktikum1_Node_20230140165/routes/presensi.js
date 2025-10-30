const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { body, validationResult } = require('express-validator');
const { addUserData } = require('../middleware/permissionMiddleware');

// Middleware Validasi untuk endpoint PUT /:id
const validatePresensiUpdate = [
    body('checkIn').optional().isISO8601().withMessage('Format checkIn harus berupa tanggal/waktu ISO 8601 yang valid.'),
    body('checkOut').optional().isISO8601().withMessage('Format checkOut harus berupa tanggal/waktu ISO 8601 yang valid.'),
];

router.use(addUserData);
router.post('/check-in', presensiController.CheckIn);
router.post('/check-out', presensiController.CheckOut);
router.put('/:id', validatePresensiUpdate, presensiController.updatePresensi);
router.delete('/:id', presensiController.deletePresensi);

module.exports = router;