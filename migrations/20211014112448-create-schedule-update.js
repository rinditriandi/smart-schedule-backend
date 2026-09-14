'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ScheduleUpdates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      scheduleId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      program: {
        type: Sequelize.STRING
      },
      client: {
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
      createdBy: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('ScheduleUpdates');
  }
};