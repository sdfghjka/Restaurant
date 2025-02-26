const passport = require("passport");
const { Users } = require("../models");
const LocalStrategy = require("passport-local");

passport.use(
  new LocalStrategy({ usernameField: "email" }, (username, password, done) => {
    return Users.findOne({
      attributes: ["id", "name", "email", "password"],
      where: { email: username },
      raw: true,
    })
      .then((user) => {
        if (!user || user.password !== password) {
          return done(null, false, { message: "email 或密碼錯誤" });
        }
        return done(null, user);
      })
      .catch((error) => {
        error.message = "登入失敗!";
        done(error);
      });
  })
);

passport.serializeUser((user, done) => {
  const { id, email, name} = user;
  return done(null, { id, email, name});
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
      done(null, user.toJSON()); 
    })
    .catch((error) => {
      done(error, null);
    });
});

module.exports = passport;
