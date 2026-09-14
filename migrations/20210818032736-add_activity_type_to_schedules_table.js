'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Schedules', 'ActivityTypeId', Sequelize.INTEGER)

    await queryInterface.addConstraint('Schedules', {
      fields: ['ActivityTypeId'],
      type: 'foreign key',
      name: 'fk_activity_type',
      references: { //Required field
        table: 'ActivityTypes',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
