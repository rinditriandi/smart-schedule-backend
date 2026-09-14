'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn('Psses', 'PssTypeId', Sequelize.INTEGER)

    await queryInterface.addConstraint('Psses', {
      fields: ['PssTypeId'],
      type: 'foreign key',
      name: 'pss_type_fk',
      references: { //Required field
        table: 'PssTypes',
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
