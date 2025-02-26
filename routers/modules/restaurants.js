const express = require("express");
const router = express.Router();
const db = require("../../models");
const restaurant = db.Restaurant;
const restController = require("../../controllers/restController");
const authHandler = require("../../middleware/auth-handler");
//homepage
router.get("/", restController.getRestaurants);
//CREATE
router.get("/create", authHandler, restController.getCreatPage);
router.post("/add", restController.addRestaurant);

router.get("/:id", restController.getRestaurant);
//READ Detail
router.get("/edit/:id", restController.editRestaurant);
//UPDATE
router.put("/update/:id", restController.updateRestaurant);
//DELETE
router.delete("/delete/:id", restController.deleteRestaurant);
module.exports = router;
