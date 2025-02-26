const { getUser } = require("../helpers/getUser");
module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = getUser(req);
    return next();
  }
  req.flash("error", "尚未登入");
  return res.redirect("/user/login");
};
