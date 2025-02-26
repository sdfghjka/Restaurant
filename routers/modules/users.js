const express = require("express");
const router = express.Router();
const { Users } = require("../../models");
const passport = require("../../config/passport");
const userController = require("../../controllers/userController");

router.get("/register", userController.getRegisterPage);
router.get("/login", userController.getLoginPage);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/restaurants",
    failureRedirect: "back",
    failureFlash: true,
  })
);
router.get('/logout',userController.logout)

router.post("/Register", userController.postRegister);
module.exports = router;
