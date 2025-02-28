const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/adminController");

router.get("/users", adminController.getUsers);
router.get("/restaurants", adminController.getRestaurants);
router.patch('/users/:id',adminController.patchUser )

module.exports = router;
