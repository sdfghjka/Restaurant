const express = require("express");
const router = express.Router();
const { Users } = require("../../models");
const passport = require("../../config/passport");
const userController = require("../../controllers/userController");
const { route } = require("./restaurants");

router.get("/register", userController.getRegisterPage);
router.get("/login", userController.getLoginPage);
router.get("/:id",userController.getUser);
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "back",
    failureFlash: true,
  }),
  userController.loginSuccess 
);
router.get('/logout',userController.logout)

router.post("/Register", userController.signUp);
module.exports = router;
