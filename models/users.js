"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Users.hasMany(models.Restaurant, { foreignKey: 'userId' });
      Users.hasMany(models.Comment, { foreignKey: "user_id" });
      Users.belongsToMany(models.Restaurant, {
        through: models.Favorite,
        foreignKey: 'user_id',
        as: 'FavoritedRestaurants'
      });
      Users.belongsToMany(Users, {
        through: models.Followship,
        foreignKey: 'following_id',
        as: 'Followers'
      });
      Users.belongsToMany(Users, {
        through: models.Followship,
        foreignKey: 'follower_id',
        as: 'Followings'
      })
    }
  }
  Users.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      is_admin: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      timestamps: true,
      tableName: "Users",
      modelName: "Users",
    }
  );
  return Users;
};
