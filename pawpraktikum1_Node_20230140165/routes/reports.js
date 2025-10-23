// routes/reports.js

const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController'); // Sudah benar
const { addUserData, isAdmin } = require('../middleware/permissionMiddleware');

// UBAH .getDailyReport MENJADI .dailyReport
router.get('/daily', [addUserData, isAdmin], reportController.dailyReport); 
                                                            // ^---- PERUBAHAN INI

module.exports = router;