'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Restaurants', 'userId', {
      type: Sequelize.INTEGER, // Use Sequelize.INTEGER instead of sequelize.INTEGER
      references: {
        model: 'Users', // The table to reference
        key: 'id', // The column to reference in the 'Users' table
      },
      onDelete: 'CASCADE', // Add cascade behavior for deletions
      onUpdate: 'CASCADE', // Add cascade behavior for updates
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Restaurants', 'userId');
  },
};

