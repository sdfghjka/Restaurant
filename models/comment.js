'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Comment.belongsTo(models.Restaurant, { foreignKey: 'restaurant_id' })
      Comment.belongsTo(models.Users, { foreignKey: 'user_id' })
    }
  };
  Comment.init({
    text: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    restaurant_id: DataTypes.INTEGER 
  }, {
    sequelize,
    modelName: 'Comment',
    tableName: 'Comments',
  })
  return Comment
}