const { getUser } = require("../helpers/getUser");
module.exports = (req, res, next) => {
  res.locals.user = getUser(req);
  res.locals.success_msg = req.flash("success_msg");
  console.log(res.locals.success_msg)
  res.locals.error_msg = req.flash("error_msg");
  next();
};
