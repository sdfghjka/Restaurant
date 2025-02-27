'use strict'
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await Promise.all(Array.from({ length: 10 }, async (_, i) => ({
      email: `user${i}@example.com`,
      password: await bcrypt.hash('123', 10),
      is_admin: true,
      name: 'root',
      createdAt: new Date(),
      updatedAt: new Date()
    })))

    await queryInterface.bulkInsert('Users', users, {})
  },
  down: async (queryInterface, Sequelize) => { 
    await queryInterface.bulkDelete('Users', null, {})
  }
}
