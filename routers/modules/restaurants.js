const express = require("express");
const router = express.Router();
const db = require("../../models");
const restaurant = db.Restaurant;
const restController = require("../../controllers/restController");
//CREATE
router.get("/create",restController.getCreatPage);
router.post("/add", restController.addRestaurant);

//UPDATE
router.put("/update/:id", restController.updateRestaurant);
//DELETE
router.delete("/delete/:id", restController.deleteRestaurant);
//EDIT 
router.get("/:id/edit", restController.editRestaurant);
//READ Detail
router.get("/:id", restController.getRestaurant);
//homepage
router.get("/", restController.getRestaurants);




module.exports = router;
