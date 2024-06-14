import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/user.js";

const passportConfig = function(passport) {

  const verifyCallback = async function(username, password, done) {
    try {
      const user = await User.findOne({ username });
      if (!user) return done(null, false);
      const match = validPassword(password, user.hash, user.salt);
      if (!match) return done(null, false);
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  };
  
  const strategy = new LocalStrategy(verifyCallback);

  passport.use(strategy);

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (userId, done) => {
    try {
      const user = await User.findById(userId);
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  });
};

export default passportConfig;
