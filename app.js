const express = require("express");
const app = express();
const port = 3000;
const { engine } = require("express-handlebars");
// const restaurants = require('./public/jsons/restaurant.json').results
//
const db = require("./models");
const { where } = require("sequelize");
const { raw } = require("mysql2");

const restaurant = db.Restaurant;
//
const session = require("express-session");
const flash = require("connect-flash");

const methodOverride = require("method-override");
//session
app.use(
  session({
    secret: "ThisIsSecret",
    resave: false,
    saveUninitialized: false,
  })
);
//flash
app.use(flash());
//temeplate
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");
app.use(express.static("public"));
//
app.use(express.urlencoded({ extended: true }));
//
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.redirect("/restaurants");
});
app.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await restaurant.findAll(); // 使用 await 獲取資料
    const rest = restaurants.map((restaurant) => restaurant.toJSON());
    const keyword = req.query.keyword?.trim();
    const matchesRestaurant = keyword
      ? rest.filter((restaurant) =>
          Object.values(restaurant).some(
            (property) =>
              typeof property === "string" &&
              property.toLowerCase().includes(keyword.toLowerCase())
          )
        )
      : rest;
    res.render("index", { restaurants: matchesRestaurant, keyword, message: req.flash('success')});
  } catch (error) {
    console.error(error); // 錯誤處理
    res.status(500).send("Internal Server Error");
  }
});
//CREATE
app.get("/restaurants/create", (req, res) => {
  res.render("create");
});
app.post("/restaurants/add", (req, res) => {
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
    });
});

app.get("/restaurants/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const restaurants = await restaurant.findByPk(id, {
      raw: true,
    });
    // const restaurant = restaurants.find((restaurant) => restaurant.id.toString() === id);
    if (!restaurant) {
      return res.status(404).send("Restaurant not found");
    }
    res.render("detail", { restaurant: restaurants, message: req.flash('success')});
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`);
});
//READ Detail
app.get("/restaurants/edit/:id", async (req, res) => {
  const { id } = req.params;
  const RTR = await restaurant.findByPk(id, {
    raw: true,
  });
  res.render("edit", { restaurant: RTR });
});
//UPDATE
app.put("/restaurants/update/:id", (req, res) => {
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
      res.redirect(`/restaurants/${id}`)});
});
//DELETE
app.delete("/restaurants/delete/:id", (req, res) => {
  const { id } = req.params;
  return restaurant.destroy({ where: { id } }).then(() => {
    req.flash("success", "Delete Successed");
    res.redirect("/restaurants");
  });
});
