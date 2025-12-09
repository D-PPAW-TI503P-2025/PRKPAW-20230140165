'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Fungsi UP: Menambahkan kolom baru ke tabel Presensis
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Presensis', 'buktiFoto', {
      type: Sequelize.STRING, // Kita simpan path/nama filenya saja [cite: 886]
      allowNull: true // Boleh null [cite: 887]
    });
  },

  // Fungsi DOWN: Menghapus kolom jika rollback dilakukan
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Presensis', 'buktiFoto');
  }
};