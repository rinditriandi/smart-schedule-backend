'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Schedules', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ProgramId: {
        type: Sequelize.STRING
      },
      ClientId: {
        type: Sequelize.STRING
      },
      dateFrom: {
        type: Sequelize.DATE,
        allowNull: false
      },
      dateTo: {
        type: Sequelize.DATE,
        allowNull: false
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      month: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      group: {
        type: Sequelize.STRING,
        allowNull: false
      },
      gcalId: {
        type: Sequelize.STRING
      },
      createdBy: {
        type: Sequelize.STRING,
        allowNull: false
      },
      updatedBy: {
        type: Sequelize.STRING,
        allowNull: false
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
    await queryInterface.dropTable('Schedules');
  }
};