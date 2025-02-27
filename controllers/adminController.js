const { raw } = require("mysql2");
const { Users, Restaurant } = require("../models");

const adminController = {
  getUsers: (req, res, next) => {
    Users.findAll({
      raw: true,
    }).then((users) => {
      return res.render("admin/users", { users: users, layout: false });
    }).catch((error)=>{
      next(error)
    })
  },
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      raw: true,
    }).then((rest) => {
      return res.render("admin/restaurants", {
        restaurants: rest,
        layout: false,
      });
    });
  },
};

module.exports = adminController;
