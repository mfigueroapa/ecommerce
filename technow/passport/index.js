// const passport = require('passport');

// require('./serializers');
// require('./localStrategy');

// module.exports = (app)  => {
//   app.use(passport.initialize());
//   app.use(passport.session());
// }


const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
const bcrypt = require('bcrypt');








passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  (email, password, done) => {
    User.findOne({
        email
      })
      .then(foundUser => {
        if (!foundUser) {
          done(null, false, {
            message: 'Incorrect username'
          });
          return;
        }

        if (!bcrypt.compareSync(password, foundUser.password)) {
          done(null, false, {
            message: 'Incorrect password'
          });
          return;
        }

        done(null, foundUser);
      })
      .catch(err => done(err));
  }
));

passport.use(
  new GoogleStrategy({
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "/auth/google/callback"
    },
    async (_, __, profile, done) => {
      const user = await User.findOne({
        googleID: profile.id
      })

      if (user) {
        return done(null, user)
      }

      const newUser = await User.create({
        googleID: profile.id,
        email: profile.emails[0].value
      })

      done(null, newUser)
    }
  )
)
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await User.findOne({
        facebookID: profile.id
      })
      if (user) {
        return done(null, user)
      }

      const newUser = await User.create({
        email: profile.user.email,
        facebookID: profile.id
      })

      done(null, newUser)
    } catch (err) {
      done(err)
    }
  }
));

passport.serializeUser((loggedInUser, cb) => {
  cb(null, loggedInUser._id);
});

passport.deserializeUser((userIdFromSession, cb) => {
  User.findById(userIdFromSession)
    .then(userDocument => {
      cb(null, userDocument);
    })
    .catch(err => {
      cb(err);
    })
});

module.exports = passport