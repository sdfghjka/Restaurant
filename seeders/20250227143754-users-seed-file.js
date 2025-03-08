"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = Array.from({ length: 10 }).map((_, i) => ({
      email: `user${i}@example.com`,
      password: bcrypt.hashSync("123", 10),
      is_admin: i === 0,
      name: "root",
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("Users", users, {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
