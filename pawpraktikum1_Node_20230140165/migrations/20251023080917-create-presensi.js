'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Presensis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false // Ditambahkan: userId tidak boleh kosong
      },
      nama: { // Ditambahkan: Kolom nama
        type: Sequelize.STRING,
        allowNull: false
      },
      checkIn: { // Ditambahkan: Kolom checkIn
        allowNull: false,
        type: Sequelize.DATE
      },
      checkOut: { // Ditambahkan: Kolom checkOut
        allowNull: true, // checkOut bisa kosong saat pertama kali check-in
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Presensis');
  }
};