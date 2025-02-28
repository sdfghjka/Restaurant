const { Restaurant, Category } = require("../models");
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const restController = {
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT = 9 
    const categoryId = Number(req.query.categoryId) || '';
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    return Promise.all([
      Restaurant.findAndCountAll({
        raw: true,
        nest: true,
        where: {  
          ...categoryId ? { categoryId } : {} 
        },
        limit,
        offset,
        include: [Category],
      }),
      Category.findAll({
        raw: true,
      }),
    ])
    .then(([restaurants, categories]) => { 
      res.render("index", {
        restaurants: restaurants.rows,
        categories,
        keyword: req.query.keyword || "", 
        categoryId, 
        pagination: getPagination(limit, page, restaurants.count)
      })
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
      userId: req.user.id,
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
  getRestaurant: (req, res, next) => {
    const { id } = req.params;

    return Restaurant.findByPk(id, {
      include: [Category],
      nest: true,
    })
      .then((restaurant) => {
        restaurant.increment({ view_Counts: 1 });
        return restaurant.toJSON();
      })
      .then((restaurant) => {
        return res.render("detail", {
          restaurant: restaurant,
          layout: false,
        });
      })
      .catch((error) => {
        next(error);
      });
  },
  editRestaurant: async (req, res) => {
    const { id } = req.params;
    await Promise.all([
      Restaurant.findByPk(id, {
        raw: true,
        include: [Category],
        nest: true,
      }),
      Category.findAll({ raw: true }),
    ]).then(([RTR, categories]) => {
      return res.render("edit", { restaurant: RTR, categories });
    });
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
