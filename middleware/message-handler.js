const { getUser } = require("../helpers/getUser");
module.exports = (req, res, next) => {
  res.locals.user = getUser(req);
  res.locals.success_msg = req.flash("success");
  res.locals.error_msg = req.flash("error");
  next();
};
