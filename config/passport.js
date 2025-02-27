const passport = require("passport");
const { Users } = require("../models");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
passport.use(
  new LocalStrategy(
    { usernameField: "email", passReqToCallback: true },
    (req, username, password, done) => {
      return Users.findOne({
        attributes: ["id", "name", "email", "password"],
        where: { email: username },
        raw: true,
      })
        .then((user) => {
          if (!user) {
            return done(null, false, req.flash("error_msg", "帳號或密碼輸入錯誤！"));
          }
          bcrypt.compare(password, user.password).then((result) => {
            if (result) {
              return done(null, user);
            } else {
              return done(null, false, req.flash("error_msg", "帳號或密碼輸入錯誤！"));
            }
          });
        })
        .catch((error) => {
          return done(error);
        });
    }
  )
);

passport.serializeUser((user, done) => {
  const { id, email, name } = user;
  return done(null, { id, email, name });
});

passport.deserializeUser((userData, done) => {
  console.log("Deserializing user:", userData);

  if (!userData || !userData.id) {
    return done(new Error("Invalid user data in session"), null);
  }

  Users.findByPk(userData.id)
    .then((user) => {
      if (!user) {
        return done(new Error("User not found in database"), null);
      }
      console.log(user)
      done(null, user.toJSON());
    })
    .catch((error) => {
      done(error, null);
    });
});

module.exports = passport;
