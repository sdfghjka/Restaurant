require('dotenv').config();
const { exec } = require('child_process');
const { sequelize } = require('./models');
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());
const router = require('./routers');
const port = 3000;
const { engine } = require("express-handlebars");
const handlebarsHelpers = require('./helpers/handlebars-helpers') ;
const messageHandler = require('./middleware/message-handler'); 
const {generalErrorHandler} = require('./middleware/error-handler');
const passport = require('passport');
const session = require("express-session");
const flash = require("connect-flash");

sequelize.sync({ force: true, logging: console.log })
  .then(() => {
    console.log('資料表已經創建！');
    exec('npx sequelize-cli db:seed:all', (error, stdout, stderr) => {
      if (error) {
        console.error(`執行 Seeder 失敗: ${error}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    }); 
  })
  .catch((error) => {
    console.error('創建資料表失敗：', error);
  });

//
const methodOverride = require("method-override");
// if(process.env.NODE_ENV === 'development'){
// }
//session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
//temeplate
app.engine('hbs',engine({ extname: '.hbs', helpers: handlebarsHelpers }))
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

app.use(generalErrorHandler);
app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`);
});
