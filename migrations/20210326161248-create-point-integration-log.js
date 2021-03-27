'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PointIntegrationLogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      pointId: {
        type: Sequelize.STRING(250),
        allowNull: false,
        references: { model: 'PointRecords', key: 'id' }
      },
      status: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      log: {
        type: Sequelize.TEXT,
        allowNull: false,
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('PointIntegrationLogs');
  }
};