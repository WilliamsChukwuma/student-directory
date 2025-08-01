// // config/passport.js – This configures how users are authenticated using passport-local

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }

    const isValid = await user.validatePassword(password);

    if (!isValid) {
      return done(null, false, { message: 'Incorrect password.' });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const GitHubStrategy = require('passport-github2').Strategy;

// GitHub OAuth strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // I'm finding or creating a user based on GitHub ID
      let user = await User.findOne({ githubId: profile.id });

      if (!user) {
        user = new User({
          username: profile.username,
          githubId: profile.id
        });

        await user.save();
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));
