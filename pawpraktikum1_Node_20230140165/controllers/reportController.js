// controllers/reportController.js

const { Presensi } = require("../models"); // Import model Sequelize

exports.dailyReport = async (req, res) => {
    try {
        // Menggunakan Presensi.findAll() untuk mengambil semua data presensi dari database
        const allRecords = await Presensi.findAll({
            // Optional: Mengambil kolom tertentu saja atau menambahkan sorting
            order: [
                ['checkIn', 'DESC'], // Urutkan berdasarkan waktu checkIn terbaru
            ]
        });

        res.json({
            reportDate: new Date().toLocaleDateString(),
            data: allRecords, // Mengirimkan data yang diambil dari database
        });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data laporan", error: error.message });
    }
};