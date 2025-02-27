const { where } = require("sequelize");
const { Users } = require("../models");
const bcrypt = require('bcrypt');
const userController = {
  getRegisterPage: (req, res) => {
    res.render("register", { layout: false });
  },
  getLoginPage: (req, res) => {
    res.render("login", { layout: false });
  },
  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body;
    if(!name || !email ||!password) throw new Error('註冊失敗');
    if(password !== passwordCheck) throw new Error("Passwords do not match!")
    Users.findOne({
      where: {email: email}
    })
    .then((user)=>{
      if(user) throw new Error('Email already exists!')
      return bcrypt.hash(password, 10)
    })
    .then((hash)=>{
      Users.create({
        name,
        email,
        password: hash,
      })
    })
    .then(() => {
        req.flash("success_msg", "註冊成功!");
        return res.redirect("/user/login");
      })
    .catch((error)=>{
      next(error)
    })
  },
  logout: (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success_msg", "登出成功");

      return res.redirect("/user/login");
    });
  },
  loginSuccess: (req, res) => {
    req.flash("success_msg", "登入成功!");
    res.redirect("/restaurants");
  },
};
module.exports = userController;
