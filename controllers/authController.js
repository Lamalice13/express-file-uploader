import passport from "passport";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";

export function getLoginPage(req, res) {
  if (req.isAuthenticated()) return res.redirect("/home");
  return res.render("login");
}

export async function login(req, res) {
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/",
  });
}

export function getRegisterPage(req, res) {
  if (req.isAuthenticated()) return res.redirect("/home");
  return res.render("signup");
}

export async function register(req, res, next) {
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
      return res.redirect("/home");
    });
  } catch (e) {
    next(e);
  }
}
