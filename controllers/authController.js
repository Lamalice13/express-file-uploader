import passport from "passport";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import { validationResult, matchedData } from "express-validator";

export function getLoginPage(req, res) {
  if (req.isAuthenticated()) return res.redirect("/home");
  return res.render("login");
}

export async function login(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("login", {
      errors: errors.array(),
    });
  }
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/",
  })(req, res, next);
}

export async function logout(req, res, next) {
  req.logout((err) => {
    if (err) return next(err);
  });
  res.redirect("/");
}

export function getRegisterPage(req, res) {
  if (req.isAuthenticated()) return res.redirect("/home");
  return res.render("signup");
}

export async function register(req, res, next) {
  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    return res.render("signup", {
      errors: errors.array(),
    });
  }

  try {
    const { username, email, password } = matchedData(req);
    console.log(matchedData(req));
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
      return res.redirect("/home");
    });
  } catch (e) {
    next(e);
  }
}
