// controllers/reportController.js

const { Presensi } = require("../models"); // Import model Sequelize
const { Op } = require("sequelize");

exports.dailyReport = async (req, res) => {
    try {
        // Ambil parameter kueri dari URL
        const { nama, tanggalMulai, tanggalSelesai } = req.query; // 

        let options = { 
            where: {}, 
            order: [['checkIn', 'DESC']] // Urutkan default
        };

        // 1. Filter Berdasarkan Nama (Sudah ada di modul, dimodifikasi ke dailyReport)
        if (nama) {
            options.where.nama = {
                [Op.like]: `%${nama}%`,
            };
        }

        // 2. Filter Berdasarkan Rentang Tanggal (Tugas 1) 
        if (tanggalMulai && tanggalSelesai) {
            // Kita asumsikan kolom yang menyimpan waktu adalah 'checkIn'
            // Catatan: Gunakan ISO 8601 (YYYY-MM-DD) untuk format yang aman di JavaScript Date
            
            // Mengatur tanggalMulai ke awal hari (00:00:00)
            const startDate = new Date(tanggalMulai);
            startDate.setHours(0, 0, 0, 0); 

            // Mengatur tanggalSelesai ke akhir hari (23:59:59.999)
            const endDate = new Date(tanggalSelesai);
            endDate.setHours(23, 59, 59, 999);

            // Terapkan filter rentang tanggal pada kolom 'checkIn' menggunakan Op.between
            options.where.checkIn = { 
                [Op.between]: [startDate, endDate] // 
            };
        }

        // Menggunakan Presensi.findAll() dengan options yang sudah difilter
        const records = await Presensi.findAll(options);

        res.json({
            // Menampilkan informasi tambahan jika ada filter tanggal
            reportDate: tanggalMulai && tanggalSelesai ? `Laporan dari ${tanggalMulai} sampai ${tanggalSelesai}` : new Date().toLocaleDateString(),
            data: records, // Mengirimkan data yang diambil dari database
        });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil laporan", error: error.message }); // [cite: 125]
    }
};