const express = require("express");
const router = express.Router();
const db = require("../models");
const User = db.Users;
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { where } = require("sequelize");
const { raw } = require("mysql2");

router.get("/register", (req, res) => {
  res.render("register", { layout: false });
});
passport.use(
  new LocalStrategy({ usernameField: "email" }, (username, password, done) => {
    return User.findOne({
      attributes: ["id", "name", "email", "password"],
      where: { email: username },
      raw: true,
    })
      .then((user) => {
        if (!user || user.password !== password) {
          return done(null, false, { message: "email 或密碼錯誤" });
        }
        return done(null, user);
      })
      .catch((error) => {
        error.message = "登入失敗!";
        done(error);
      });
  })
);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/restaurants",
    failureRedirect: "/restaurants",
    failureFlash: true,
  })
);
passport.serializeUser((user, done) => {
  const { id, email, name } = user;
  return done(null, { id, email, name });
});
router.post("/Register", (req, res, next) => {
  const { name, email, password } = req.body;
  User.create({
    name,
    email,
    password,
  })
    .then(() => {
      req.flash("success", "註冊成功!");
      return res.redirect("/restaurants");
    })
    .catch((error) => {
      error.message = "註冊失敗!";
      next(error);
    });
});
module.exports = router;
