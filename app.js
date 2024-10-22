const express = require("express")
const app = express()
const port = 3000
const { engine } = require('express-handlebars')
// const restaurants = require('./public/jsons/restaurant.json').results
// 
const db = require('./models');
const restaurant = db.Restaurant;




app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))


app.get('/', (req, res) => {
  res.redirect('/restaurants')
})
app.get('/restaurants', async (req, res) => {
  try {
      const restaurants = await restaurant.findAll(); // 使用 await 獲取資料
      const rest = restaurants.map(restaurant => restaurant.toJSON());
      const keyword = req.query.keyword?.trim();
      const matchesRestaurant = keyword 
          ? rest.filter((restaurant) => 
              Object.values(restaurant).some((property) => 
                  typeof property === "string" && 
                  property.toLowerCase().includes(keyword.toLowerCase())
              )
          ) 
          : rest;
      res.render('index', { restaurants: matchesRestaurant, keyword });
  } catch (error) {
      console.error(error); // 錯誤處理
      res.status(500).send('Internal Server Error');
  }
});
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  const restaurant = restaurants.find((restaurant) => restaurant.id.toString() === id)
  res.render('detail', { restaurant: restaurant })
})
app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})