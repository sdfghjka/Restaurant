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
    failureRedirect: "back",
    failureFlash: true,
  }),
  userController.loginSuccess 
);
router.get("/logout", userController.logout);
router.post("/Register", userController.signUp);
router.get("/:id", userController.getUser);

module.exports = router;
