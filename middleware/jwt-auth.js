const passport = require("../config/passport");

const authenticated = (req, res, next) => {
  console.log("Cookies:", req.cookies);
  passport.authenticate("jwt", { session: false }, (err, user) => {
    // if (err || !user) {
    //   return res.status(401).json({ message: "Unauthorized" });
    // }
    req.user = user;
    next();
  })(req, res, next);
};

const authenticatedAdmin = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!user.is_admin) {
      return res.status(403).json({ message: "Forbidden: Not an admin" });
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = { authenticated, authenticatedAdmin };
