const express = require("express");
const router = express.Router();
const restaurant = require("./modules/restaurants");
const users = require("./modules/users");
const userController = require("../controllers/userController");
const authenticate = require("../middleware/auth-handler");

router.use("/restaurants", authenticate, restaurant);
router.use("/user", users);

router.get("/", (req, res) => {
  res.redirect("/restaurants");
});

module.exports = router;
