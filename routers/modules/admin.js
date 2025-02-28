const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/adminController");

router.get("/users", adminController.getUsers);
router.get("/restaurants", adminController.getRestaurants);
router.patch("/users/:id", adminController.patchUser);
router.get("/categories/:id", adminController.getCategories);
router.put("/categories/:id", adminController.putCategory);
router.get("/categories", adminController.getCategory);
router.post("/categories", adminController.postCategory);
module.exports = router;
