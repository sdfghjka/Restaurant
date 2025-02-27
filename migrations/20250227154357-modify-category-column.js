'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Restaurants', 'category');

    await queryInterface.addColumn('Restaurants', 'category', {
      type: Sequelize.INTEGER,
      allowNull: true, 
      defaultValue: 1 
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Restaurants', 'category');

    await queryInterface.addColumn('Restaurants', 'category', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};
