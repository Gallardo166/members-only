import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

const passportConfig = function(passport) {

  const verifyCallback = async function(username, password, done) {
    try {
      const user = await User.findOne({ username }).exec();
      if (!user) return done(null, false, { message: "Incorrect username or password." });
      const match = await bcrypt.compare(password, user.password);
      if (!match) return done(null, false, { message: "Incorrect username or password." });
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
