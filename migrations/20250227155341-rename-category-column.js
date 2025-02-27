'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('Restaurants', 'category', 'categoryId');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('Restaurants', 'categoryId', 'category');
  }
};
