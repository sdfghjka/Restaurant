const express = require("express");
const app = express();
const router = require('./routers');
const port = 3000;
const { engine } = require("express-handlebars");
// const restaurants = require('./public/jsons/restaurant.json').results
const messageHandler = require('./middleware/message-handler'); 
const errorHandler = require('./middleware/error-handler');
//
const passport = require('passport');
const session = require("express-session");
const flash = require("connect-flash");
//
const methodOverride = require("method-override");
if(process.env.NODE_ENV === 'development'){
  require('dotenv').config()
}
//session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
//temeplate
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");
app.use(express.static("public"));
//
//flash
app.use(flash());
//
app.use(passport.initialize());
app.use(passport.session());
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
