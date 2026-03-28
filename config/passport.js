import passport from "passport";
import passportLocal from "passport-local";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";

const LocalStrategy = passportLocal.Strategy;
const strategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (!user) {
      return done(null, { message: "Incorrect username or password" });
    }
    const isPasswordCorrect = bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return done(null, { message: "Incorrect username or password" });
    }

    return done(null, user);
  } catch (e) {
    done(e);
  }
});

passport.use(strategy);

// Extract id from login user request
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Requests db with the id extracted from req.session
passport.deserializeUser(async (id, done) => {
  try {
    const user = prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    done(user);
  } catch (e) {
    done(e);
  }
});
