const { raw } = require("mysql2");
const { Users, Restaurant } = require("../models");
const { patch } = require("../routers/modules/admin");

const adminController = {
  getUsers: (req, res, next) => {
    Users.findAll({
      raw: true,
    })
      .then((users) => {
        return res.render("admin/users", { users: users, layout: false });
      })
      .catch((error) => {
        next(error);
      });
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
  patchUser: (req, res, next) => {
    const { id } = req.params;
    return Users.findByPk(id)
      .then((user) => {
        if (!user) throw new Error("User didn't exist!");
        if (user.email === "kxnenao100@gmail.com") {
          req.flash("error_msg", "禁止變更 root 權限");
          return res.redirect("back");
        }
        return user.update({
          is_admin: !user.is_admin,
        });
      })
      .then(() => {
        req.flash("success_msg", "使用者權限變更成功");
        return res.redirect("/admin/users");
      })
      .catch((error) => {
        next(error);
      });
  },
};

module.exports = adminController;
