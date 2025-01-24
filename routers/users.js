const express = require("express");
const router = express.Router();
const db = require("../models");
const User = db.Users;

router.get("/register", (req, res) => {
   res.render('register',{ layout: false });
});
router.post('/Register',(req, res, next)=>{
   const {name, email, password} = req.body;
   User.create({
      name,
      email,
      password
   }).then(()=> {req.flash('success', '註冊成功!');
      return res.redirect('/restaurants');
   } )
   .catch((error)=>{
      error.message = "註冊失敗!";
      next(error)
   })
})
module.exports = router;
