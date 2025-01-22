const express = require("express");
const app = express();
const router = require('./routers');
const port = 3000;
const { engine } = require("express-handlebars");
// const restaurants = require('./public/jsons/restaurant.json').results
const messageHandler = require('./middleware/message-handler'); 
const errorHandler = require('./middleware/error-handler');
//
const session = require("express-session");
const flash = require("connect-flash");
//
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

app.use(messageHandler);

app.use(router);

app.use(errorHandler);
app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`);
});
