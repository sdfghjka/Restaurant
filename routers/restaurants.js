const express = require("express");
const router = express.Router();
const db = require("../models");
const { raw } = require("mysql2");
const restaurant = db.Restaurant;
//homepage
router.get("/", async (req, res, next) => {
  
  try {
    const perPage = 9;
    const currentPage = parseInt(req.query.page) || 1;
    const Previous = currentPage - 1;
    const NextPage = currentPage + 1;
    const isFirst = currentPage === 1;
    const restaurants = await restaurant.findAndCountAll({
      raw: true,
      offset: (currentPage-1) * 9,
      limit: perPage
    });
    const totalsPages = Math.ceil(restaurants.count/perPage);
    const pagination = Array.from({ length: totalsPages}, (_,i)=>({
      current: i + 1,
      isCurrent: i + 1 === currentPage
    }))
    const isLast = (NextPage > totalsPages);
    console.log(isLast);
    const keyword = req.query.keyword?.trim();
    let matchesRestaurant = keyword
      ? restaurants.rows.filter((restaurant) =>
          Object.values(restaurant).some(
            (property) =>
              typeof property === "string" &&
              property.toLowerCase().includes(keyword.toLowerCase())
          )
        )
      : restaurants.rows;
    if (matchesRestaurant.length === 0 && keyword) {
      matchesRestaurant = restaurants.rows;
      req.flash("success", "未找到符合條件的資料！");
    }
    return res.render("index", {
      restaurants: matchesRestaurant,
      keyword,
      isFirst,
      isLast,
      currentPage,
      pagination,
      Previous,
      NextPage
    });
  } catch (error) {
    next(error);
  }
});
//CREATE
router.get("/create", (req, res) => {
  res.render("create");
});
router.post("/add", (req, res, next) => {
    const {
      name,
      name_en,
      category,
      location,
      phone,
      google_map,
      rating,
      description,
      image,
    } = req.body;

    restaurant
      .create({
        name,
        name_en,
        category,
        location,
        phone,
        google_map,
        rating,
        description,
        image,
      })
      .then(() => {
        req.flash("success", "Create Successed");
        return res.redirect("/restaurants");
      })
      .catch((error) => {
        error.message = "新增資料失敗!";
        next(error);
      });
});

router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const restaurants = await restaurant.findByPk(id, {
      raw: true,
    });
    // const restaurant = restaurants.find((restaurant) => restaurant.id.toString() === id);
    if (!restaurant) {
      return res.status(404).send("Restaurant not found");
    }
    res.render("detail", {
      restaurant: restaurants,
    });
  } catch (error) {
    next(error)
  }
});
//READ Detail
router.get("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const RTR = await restaurant.findByPk(id, {
    raw: true,
  });
  res.render("edit", { restaurant: RTR });
});
//UPDATE
router.put("/update/:id", (req, res, next) => {
    const {
      name,
      name_en,
      category,
      location,
      phone,
      google_map,
      rating,
      description,
      image,
    } = req.body;
    const { id } = req.params;
    return restaurant
      .update(
        {
          name,
          name_en,
          category,
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
        req.flash("success", "Update Successed");
        res.redirect(`/restaurants/${id}`);
      })
      .catch((error) => {
        error.message = "更新資料失敗!";
        next(error);
      });
});
//DELETE
router.delete("/delete/:id", (req, res, next) => {
  try {
    const { id } = req.params;
    return restaurant.destroy({ where: { id } }).then(() => {
      req.flash("success", "Delete Successed");
      res.redirect("/restaurants");
    });
  } catch (error) {
    error.message = "刪除資料失敗!";
    next(error);
  }
});
module.exports = router;