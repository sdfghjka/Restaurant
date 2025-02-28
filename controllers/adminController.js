const { raw } = require("mysql2");
const { Users, Restaurant, Category } = require("../models");
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
  getCategory: (req, res, next) => {
    return Category.findAll({ raw: true })
      .then((categories) => {
        return res.render("admin/categories", { categories, layout: false });
      })
      .catch((error) => {
        next(error);
      });
  },
  postCategory: (req, res, next) => {
    const { name } = req.body;
    if (!name) throw new Error("Category name is required!");
    return Category.create({
      name,
    })
      .then(() => {
        req.flash("success_msg", "新增成功");
        return res.redirect("/admin/categories");
      })
      .catch((error) => {
        next(error);
      });
  },
  getCategories: (req, res, next) => {
    return Promise.all([
      Category.findAll({ raw: true }),
      req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null,
    ])
      .then(([categories, category]) => {
        res.render("admin/categories", {
          categories,
          category,
          layout: false,
        });
      })
      .catch((err) => next(err));
  },
  putCategory: (req, res, next) => {
    const { name } = req.body;
    if (!name) throw new Error("Category name is required!");
    return Category.findByPk(req.params.id)
      .then((category) => {
        if (!category) throw new Error("Category doesn't exist!");
        return category.update({ name });
      })
      .then(() => {
        req.flash("success_msg", "更新成功");
        res.redirect("/admin/categories");

      })
      .catch((err) => next(err));
  },
};

module.exports = adminController;
