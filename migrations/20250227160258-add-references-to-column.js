"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn("Restaurants", "categoryId", {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1,
        references: {
          model: "Categories",
          key: "id",
        },
      })
;
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Restaurants", "categoryId");
  },
};
