// controllers/reportController.js
const { Presensi, User } = require('../models');
const { Op } = require("sequelize");
// ... (Import lainnya jika diperlukan)

exports.dailyReport = async (req, res) => {
    // ... (SELURUH ISI FUNGSI dailyReport yang Anda kirimkan) ...
    try {
        const { nama, tanggalMulai, tanggalSelesai } = req.query; 
        // ... (Logika options, filtering, dan findAll) ...
        const records = await Presensi.findAll(options);
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil laporan", error: error.message });
    }
};