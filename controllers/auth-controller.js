const passport = require("../config/passport");
const { Users, Restaurant, Category } = require("../models");

const authController = {
  redirectURL: () => {
    passport.authenticate("facebook", {
      successRedirect: "/restaurants",
      failureRedirect: "/user/login",
      failureFlash: true,
    });
  },
};

module.exports = authController;
