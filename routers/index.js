const express = require("express");
const router = express.Router();
const restaurant = require("./modules/restaurants");
const users = require("./modules/users");
const admin =require('./modules/admin');
const {authenticated, authenticatedAdmin} = require("../middleware/jwt-auth");
const commentController = require('../controllers/comment-controller')
const userController = require('../controllers/userController')
const auth = require('./modules/auth');

router.post('/comments', authenticated, commentController.postComment) 
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment);
router.post('/following/:userId',authenticated, userController.addFollowing);
router.delete('/following/:userId',authenticated, userController.removeFollowing);
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)
router.use("/restaurants", authenticated, restaurant);
router.use("/user", users);
router.use('/auth',auth);
router.use('/admin',authenticatedAdmin, admin )
router.get("/", (req, res) => {
  res.redirect("/restaurants");
});

module.exports = router;
