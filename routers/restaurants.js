const express = require("express");
const router = express.Router();
const db = require("../models");
const restaurant = db.Restaurant;
//homepage
router.get("/", async (req, res, next) => {
  try {
    const restaurants = await restaurant.findAll(); // 使用 await 獲取資料
    const rest = restaurants.map((restaurant) => restaurant.toJSON());
    const keyword = req.query.keyword?.trim();
    let matchesRestaurant = keyword
      ? rest.filter((restaurant) =>
          Object.values(restaurant).some(
            (property) =>
              typeof property === "string" &&
              property.toLowerCase().includes(keyword.toLowerCase())
          )
        )
      : rest;
    if (matchesRestaurant.length === 0 && keyword) {
      matchesRestaurant = rest;
      req.flash("success", "未找到符合條件的資料！");
    }
    return res.render("index", {
      restaurants: matchesRestaurant,
      keyword
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