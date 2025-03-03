const express = require("express");
const router = express.Router();
const { Users } = require("../../models");
const passport = require("../../config/passport");

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
router.get(
  "/redirect/facebook",
  passport.authenticate("facebook", {
    successRedirect: "/restaurants",
    failureRedirect: "/user/login",
    failureFlash: true,
  })
);
router.get(
    "/google",
    passport.authenticate("google", { scope: ["email","profile"] })
  );
router.get(
    "/google/callback",
    passport.authenticate("google", {
      successRedirect: "/restaurants", 
      failureRedirect: "/user/login", 
      failureFlash: true,
    })
  );

module.exports = router;
