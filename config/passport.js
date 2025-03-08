const passport = require("passport");
const { Users, Restaurant, Comment } = require("../models");
const LocalStrategy = require("passport-local");
const FacebookStrategy = require("passport-facebook");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
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
            return done(
              null,
              false,
              req.flash("error_msg", "帳號或密碼輸入錯誤！")
            );
          }
          bcrypt.compare(password, user.password).then((result) => {
            if (result) {
              return done(null, user);
            } else {
              return done(
                null,
                false,
                req.flash("error_msg", "帳號或密碼輸入錯誤！")
              );
            }
          });
        })
        .catch((error) => {
          return done(error);
        });
    }
  )
);
//Facebook
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["email", "displayName"],
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      const email = profile.emails[0].value;
      const name = profile.displayName;

      return Users.findOne({
        attributes: ["id", "name", "email"],
        where: { email },
        raw: true,
      })
        .then((user) => {
          if (user) return done(null, user);

          const randomPwd = Math.random().toString(36).slice(-8);

          return bcrypt
            .hash(randomPwd, 10)
            .then((hash) => Users.create({ name, email, password: hash }))
            .then((user) =>
              done(null, { id: user.id, name: user.name, email: user.email })
            );
        })
        .catch((error) => {
          error.errorMessage = "登入失敗";
          done(error);
        });
    }
  )
);
//Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
      const name = profile.displayName;
      if (!email) return done(new Error("Google 沒有提供 Email"));
      let user = await Users.findOne({ where: { email } });
      if (!user) {
        const randomPwd = Math.random().toString(36).slice(-8);
        const hashedPwd = await bcrypt.hash(randomPwd, 10);

        user = await Users.create({
          name,
          email,
          password: hashedPwd,
        });
      }
      return done(null,user)
      } catch (error) {
        return done(error);
      }
      
    }
  )
);

passport.serializeUser((user, done) => {
  const { id, email, name } = user;
  return done(null, { id, email, name });
});

passport.deserializeUser((userData, done) => {
  if (!userData || !userData.id) {
    return done(new Error("Invalid user data in session"), null);
  }

  Users.findByPk(userData.id, {
    include: [
      { model: Restaurant, as: "FavoritedRestaurants" },
      { model: Comment, include: [Restaurant], nest: true },
      { model: Users, as: "Followers" },
      { model: Users, as: "Followings" },
    ],
  })
    .then((user) => {
      if (!user) {
        return done(new Error("User not found in database"), null);
      }
      console.log(user.toJSON());
      done(null, user.toJSON());
    })
    .catch((error) => {
      done(error, null);
    });
});

module.exports = passport;
