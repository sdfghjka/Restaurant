const { where } = require("sequelize");
const jwt = require("jsonwebtoken");
const {
  Users,
  Favorite,
  Comment,
  Restaurant,
  Followship,
} = require("../models");
const bcrypt = require("bcrypt");
const { raw } = require("mysql2");
const userController = {
  getRegisterPage: (req, res) => {
    res.render("register", { layout: false });
  },
  getLoginPage: (req, res) => {
    res.render("login", { layout: false });
  },
  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body;
    if (!name || !email || !password) throw new Error("註冊失敗");
    if (password !== passwordCheck) throw new Error("Passwords do not match!");
    Users.findOne({
      where: { email: email },
    })
      .then((user) => {
        if (user) throw new Error("Email already exists!");
        return bcrypt.hash(password, 10);
      })
      .then((hash) => {
        Users.create({
          name,
          email,
          password: hash,
        });
      })
      .then(() => {
        req.flash("success_msg", "註冊成功!");
        return res.redirect("/user/login");
      })
      .catch((error) => {
        next(error);
      });
  },
  logout: (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success_msg", "登出成功");

      return res.redirect("/user/login");
    });
  },
  loginSuccess: (req, res) => {
    req.flash("success_msg", "登入成功!");
    res.redirect("/restaurants");
  },

  addFavorite: (req, res, next) => {
    const { restaurantId } = req.params;
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: {
          user_id: req.user.id,
          restaurant_id: restaurantId,
        },
      }),
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!");
        if (favorite) throw new Error("You have favorited this restaurant!");

        return Favorite.create({
          user_id: req.user.id,
          restaurant_id: restaurantId,
        });
      })
      .then(() => res.redirect("back"))
      .catch((err) => next(err));
  },
  removeFavorite: (req, res, next) => {
    return Favorite.findOne({
      where: {
        user_id: req.user.id,
        restaurant_id: req.params.restaurantId,
      },
    })
      .then((favorite) => {
        if (!favorite) throw new Error("You haven't favorited this restaurant");

        return favorite.destroy();
      })
      .then(() => res.redirect("back"))
      .catch((err) => next(err));
  },
  getUser: (req, res, next) => {
    const userId = req.params.id;
    if (!userId) return res.render("user/profile", { layout: false });

    return Promise.all([
      Users.findByPk(userId, {
        include: [
          { model: Restaurant, as: "FavoritedRestaurants" },
          { model: Comment, include: [Restaurant], nest: true },
          { model: Users, as: "Followers" },
          { model: Users, as: "Followings" },
        ],
      }),
      Restaurant.findAll({
        raw: true,
        where: {
          userId: userId,
        },
      }),
    ])
      .then(([user, restaurants]) => {
        console.log(restaurants);
        if (!user) throw new Error("User not found");

        const isFollowed =
          req.user?.Followings?.some((f) => f.id === Number(userId)) || false;
        const userJson = user.toJSON();

        const commentedRestaurants = Array.prototype.map.apply(
          userJson.Comments,
          [
            (comment) => ({
              ...comment,
              Restaurant: comment.Restaurant
                ? JSON.parse(JSON.stringify(comment.Restaurant))
                : null,
            }),
          ]
        );
        console.log(commentedRestaurants);
        return res.render("user/profile", {
          layout: false,
          viewedUser: {
            ...user.toJSON(),
            Comments: commentedRestaurants,
            isFollowed,
            publishedRestaurants: restaurants,
          },
        });
      })
      .catch(next);
  },
  addFollowing: (req, res, next) => {
    const followingId = req.params.userId;
    if (!followingId) throw new Error("User doesn't exist");
    Promise.all([
      Users.findByPk(followingId),
      Followship.findOne({
        where: {
          follower_id: req.user.id,
          following_id: followingId,
        },
      }),
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User didn't exist!");
        if (followship) throw new Error("You are already following this user!");
        return Followship.create({
          follower_id: req.user.id,
          following_id: followingId,
        });
      })
      .then(() => res.redirect("back"))
      .catch((err) => {
        next(err);
      });
  },
  removeFollowing: (req, res, next) => {
    const followingId = req.params.userId;
    if (!followingId) throw new Error("User doesn't exist");
    return Followship.findOne({
      where: {
        follower_id: req.user.id,
        following_id: followingId,
      },
    })
      .then((followship) => {
        if (!followship) throw new Error("You haven't followed this user!");
        return followship.destroy();
      })
      .then(() => res.redirect("back"))
      .catch((err) => next(err));
  },
  signIn: (req, res, next) => {
    const userData = req.user.toJSON ? req.user.toJSON() : req.user;
    const { id, name, email, is_admin } = userData;
    const token = jwt.sign(
      { id, name, email, is_admin },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    req.flash("success_msg", "登入成功!");
    res.redirect("/restaurants");
  },
};
module.exports = userController;
