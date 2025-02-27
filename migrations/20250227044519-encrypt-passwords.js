"use strict";
const bcrypt = require("bcrypt");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      "SELECT id, password FROM Users",
      { type: Sequelize.QueryTypes.SELECT }
    );
    for (const user of users) {
      if (!user.password.startsWith("$2")) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await queryInterface.sequelize.query(
          `UPDATE Users SET password = :hashedPassword WHERE id = :id`,
          {
            replacements: { hashedPassword, id: user.id },
          }
        );
      }
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
