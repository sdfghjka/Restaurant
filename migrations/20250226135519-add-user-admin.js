'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('Users','is_admin',{
      type: DataTypes.BOOLEAN,
      defaultValue: false
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('Users','is_admin')
  }
};
