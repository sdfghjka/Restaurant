const { ensureAuthenticated, getUser } = require("../helpers/auth-helper");

const authenticated = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    return next();
  }
  return res.redirect("/user/login");
};
const authenticatedAdmin = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    if (getUser(req).is_admin) return next();
    return res.redirect("back");
  } else {
    res.redirect("/user/login");
  }
};
module.exports = {
  authenticated,
  authenticatedAdmin,
};
