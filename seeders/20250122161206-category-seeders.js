'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', [
      { name: 'Japanese', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Italian', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Chinese', createdAt: new Date(), updatedAt: new Date() },
      { name: 'French', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Korean', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
