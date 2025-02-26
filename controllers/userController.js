const { Users } = require("../models");

const userController = {
  getRegisterPage: (req, res) => {
    res.render("register", { layout: false });
  },
  getLoginPage: (req, res) => {
    res.render("login", { layout: false });
  },
  postRegister: (req, res, next) => {
    const { name, email, password } = req.body;
    Users.create({
      name,
      email,
      password,
    })
      .then(() => {
        req.flash("success_msg", "註冊成功!");
        return res.redirect("/restaurants");
      })
      .catch((error) => {
        error.message = "註冊失敗!";
        next(error);
      });
  },
  logout: (req, res, next) => {
    req.flash("success_msg", "登出成功");
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  },
};
module.exports = userController;
