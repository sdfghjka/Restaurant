"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Restaurant.belongsTo(models.Users, {
        foreignKey: "userId",
      });
      Restaurant.belongsTo(models.Category, { foreignKey: "categoryId" });
      Restaurant.hasMany(models.Comment, { foreignKey: "restaurant_id" });
      Restaurant.belongsToMany(models.Users, {
        through: models.Favorite,
        foreignKey: "restaurant_id",
        as: "FavoritedUsers",
      });
    }
  }
  Restaurant.init(
    {
      name: DataTypes.STRING,
      name_en: DataTypes.STRING,
      categoryId: DataTypes.INTEGER,
      image: DataTypes.STRING,
      location: DataTypes.STRING,
      phone: DataTypes.STRING,
      google_map: DataTypes.STRING,
      rating: DataTypes.DECIMAL,
      description: DataTypes.TEXT,
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      view_Counts: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Restaurant",
      tableName: "Restaurants",
      timestamps: true,
    }
  );
  return Restaurant;
};
