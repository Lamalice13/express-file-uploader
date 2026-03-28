import express from "express";
import "dotenv/config";
import "./config/passport.js";
import bcrypt from "bcryptjs";
import passport from "passport";
import expressSession from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { prisma } from "./lib/prisma.js";

const app = express();

// CONFIG
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("views", "./views");
app.set("view engine", "ejs");

// SESSION
app.use(
  expressSession({
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // ms
    secret: process.env.SECRET_CODE,
    saveUninitialized: false,
    resave: false,
    // express session management via Prisma's database client.
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

// PASSPORT
// Retrieve user at every request via deserializeUser()
app.use(passport.session());

// ROUTES

// Log in
app
  .route("/login")
  .get((req, res) => {
    if (req.isAuthenticated()) return res.redirect("/");
    return res.render("login");
  })
  .post((req, res) => {
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
    });
  });

// Sign up
app
  .route("/signup")
  .get((req, res) => {
    if (req.isAuthenticated()) return res.redirect("/");
    res.render("signup");
  })
  .post(async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const user = await prisma.user.create({
        data: {
          username: username,
          email: email,
          password: await bcrypt.hash(password, 10),
        },
        select: {
          id: true,
          username: true,
          email: true,
          password: true,
        },
      });
      // calls serializeUser(), populate req.session + req.user
      req.login(user, (e) => {
        if (e) return next(e);
        return res.redirect("/");
      });
    } catch (e) {
      next(e);
    }
  });

// PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, (e) => {
  if (e) return console.log(e);
  console.log(`Server running on ${PORT}`);
});
