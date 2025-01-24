const express = require("express");
const router = express.Router();
const restaurant = require('./restaurants');
const users = require('./users');

router.use('/restaurants',restaurant);
router.use('/user',users);

router.get("/", (req, res) => {
    res.redirect("/restaurants");
  });

module.exports = router;