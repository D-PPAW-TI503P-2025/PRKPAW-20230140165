const { Presensi, User, Op } = require('../models');
const { validationResult } = require('express-validator');


// --- Presensi Functions ---

// controllers/presensiController.js

exports.checkIn = async (req, res) => {
    try {
        const userId = req.user.id; // Ambil dari JWT

        // [MODUL 9 FIX] Ambil latitude dan longitude dari body
        const { latitude, longitude } = req.body;

        const existingPresensi = await Presensi.findOne({
            where: { userId: userId, checkOut: null },
        });

        if (existingPresensi) {
            return res.status(400).json({ message: "Anda sudah Check-In dan belum Check-Out." });
        }

        // [MODUL 9 FIX] Simpan data lokasi ke database
        const newPresensi = await Presensi.create({
            userId: userId,
            checkIn: new Date(),
            latitude: latitude, // Simpan latitude [cite: 308]
            longitude: longitude // Simpan longitude [cite: 309]
        });


        return res.status(201).json({ message: "Check-In berhasil", data: newPresensi });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

exports.checkOut = async (req, res) => {
    try {
        const userId = req.user.id; // Ambil dari JWT
        const presensiToUpdate = await Presensi.findOne({
            where: { userId: userId, checkOut: null },
        });

        if (!presensiToUpdate) { return res.status(404).json({ message: "Anda belum Check-In hari ini." }); }

        presensiToUpdate.checkOut = new Date();
        await presensiToUpdate.save();

        return res.json({ message: "Check-Out berhasil", data: presensiToUpdate });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

exports.updatePresensi = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { return res.status(400).json({ message: "Validasi gagal", errors: errors.array() }); }

    try {
        const presensiId = req.params.id;
        const { checkIn, checkOut } = req.body;

        if (checkIn === undefined && checkOut === undefined) {
            return res.status(400).json({ message: "Request body tidak berisi data yang valid untuk diupdate." });
        }
        const recordToUpdate = await Presensi.findByPk(presensiId);

        if (!recordToUpdate) { return res.status(404).json({ message: "Catatan presensi tidak ditemukan." }); }

        recordToUpdate.checkIn = checkIn || recordToUpdate.checkIn;
        recordToUpdate.checkOut = checkOut || recordToUpdate.checkOut;

        await recordToUpdate.save();
        res.json({ message: "Data presensi berhasil diperbarui.", data: recordToUpdate });

    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};

exports.deletePresensi = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const presensiId = req.params.id;

        const recordToDelete = await Presensi.findByPk(presensiId);

        if (!recordToDelete) { return res.status(404).json({ message: "Catatan presensi tidak ditemukan." }); }

        if (recordToDelete.userId !== userId) { return res.status(403).json({ message: "Akses ditolak: Anda bukan pemilik catatan ini." }); }

        await recordToDelete.destroy();
        res.status(204).send();

    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// --- Report Function ---

exports.dailyReport = async (req, res) => {
    try {
        const { nama, tanggalMulai, tanggalSelesai } = req.query;

        let options = {
            where: {},
            order: [['checkIn', 'DESC']],
            include: [{
                model: User,
                attributes: ['nama'],
                required: true,
                where: {}
            }]
        };

        if (nama && nama.length > 0) {
            options.include[0].where.nama = { [Op.like]: `%${nama}%` };
        } else {
            // Pastikan where kosong jika tidak ada filter
            options.include[0].where = {};
        }

        if (tanggalMulai && tanggalSelesai) {
            const startDate = new Date(tanggalMulai);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(tanggalSelesai);
            endDate.setHours(23, 59, 59, 999);

            options.where.checkIn = { [Op.between]: [startDate, endDate] };
        }

        // [FIX] Presensi.findAll dilakukan di sini (SETELAH semua options diatur)
        const records = await Presensi.findAll(options);

        // Console log sekarang valid
        console.log("LAPORAN DITEMUKAN:", records.length, "items.");

        // [FIX] Response hanya sekali di akhir
        res.json(records);

    } catch (error) {
        console.error("REPORT ERROR:", error);
        res.status(500).json({ message: "Gagal mengambil laporan", error: error.message });
    }
};