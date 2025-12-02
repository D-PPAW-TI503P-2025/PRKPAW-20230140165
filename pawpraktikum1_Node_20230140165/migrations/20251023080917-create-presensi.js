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
        allowNull: false,
        // [FIX KRITIS] Setting Foreign Key ke tabel Users
        references: {
          model: 'Users', // Nama tabel tujuan
          key: 'id',      // Nama kolom tujuan
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      checkIn: {
        allowNull: false,
        type: Sequelize.DATE
      },
      checkOut: {
        allowNull: true,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false, // Sebaiknya disetel false untuk integritas data
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false, // Sebaiknya disetel false untuk integritas data
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Presensis');
  }
};