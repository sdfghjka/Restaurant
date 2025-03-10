const express = require("express");
const router = express.Router();
const db = require("../../models");
const restaurant = db.Restaurant;
const restController = require("../../controllers/restController");
const upload = require('../../middleware/multer'); 
//CREATE
router.get("/create",restController.getCreatPage);
router.post("/add", upload.single('image'),restController.addRestaurant);

//UPDATE
router.put("/update/:id",upload.single('image'), restController.updateRestaurant);
//DELETE
router.delete("/delete/:id", restController.deleteRestaurant);
//EDIT 
router.get("/:id/edit", restController.editRestaurant);
//READ Detail
router.get("/:id", restController.getRestaurant);
//homepage
router.get("/", restController.getRestaurants);




module.exports = router;
