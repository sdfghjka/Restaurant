const { raw } = require("mysql2");
const { Restaurant, Category } = require("../models");
const restController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category],
    })
      .then((restaurants) => {
        res.render("index", { restaurants });
      })
      .catch((error) => {
        next(error);
      });
  },
  getCreatPage: (req, res) => {
    return Category.findAll({
      raw: true,
    }).then((categories) => {
      res.render("create", { categories });
    });
  },
  addRestaurant: (req, res, next) => {
    const {
      name,
      name_en,
      categoryId,
      location,
      phone,
      google_map,
      rating,
      description,
      image,
    } = req.body;

    return Restaurant.create({
      name,
      name_en,
      categoryId,
      location,
      phone,
      google_map,
      rating,
      description,
      image,
      userId: req.user.id
    })
      .then(() => {
        req.flash("success_msg", "Create Successed");
        return res.redirect("/restaurants");
      })
      .catch((error) => {
        error.message = "新增資料失敗!";
        next(error);
      });
  },
  getRestaurant: async (req, res, next) => {
    const { id } = req.params;
    try {
      const restaurants = await Restaurant.findByPk(id, {
        include: [Category],
        raw: true,
        nest: true,
      });
      // const restaurant = restaurants.find((restaurant) => restaurant.id.toString() === id);
      if (!restaurants) {
        return res.status(404).send("Restaurant not found");
      }
      res.render("detail", {
        restaurant: restaurants,
      });
    } catch (error) {
      next(error);
    }
  },
  editRestaurant: async (req, res) => {
    const { id } = req.params;
    await Promise.all([
        Restaurant.findByPk(id, {
              raw: true,
              include:[Category],
              nest:true
            }),
            Category.findAll({raw:true})

    ])
    .then(([RTR, categories])=>{
      return res.render("edit", { restaurant: RTR, categories });
    })
    
  },
  updateRestaurant: (req, res, next) => {
    const {
      name,
      name_en,
      categoryId,
      location,
      phone,
      google_map,
      rating,
      description,
      image,
    } = req.body;
    const { id } = req.params;
    return Restaurant.update(
      {
        name,
        name_en,
        categoryId,
        location,
        phone,
        google_map,
        rating,
        description,
        image,
      },
      {
        where: { id: id },
      }
    )
      .then(() => {
        req.flash("success_msg", "Update Successed");
        res.redirect(`/restaurants/${id}`);
      })
      .catch((error) => {
        error.message = "更新資料失敗!";
        next(error);
      });
  },
  deleteRestaurant: (req, res, next) => {
    try {
      const { id } = req.params;
      return Restaurant.destroy({ where: { id } }).then(() => {
        req.flash("success_msg", "刪除資料成功!");
        res.redirect("back");
      });
    } catch (error) {
      error.message = "刪除資料失敗!";
      next(error);
    }
  },
};

module.exports = restController;
