import { body } from "express-validator";
import { prisma } from "../../lib/prisma.js";

export const signInValidations = [
  body("username")
    .trim()
    .isLength({ min: 4, max: 10 })
    .withMessage("Username must be between 4 and 10 characters")
    .isAlpha()
    .withMessage("Username must contain only letters"),
  body("password")
    .matches(/[A-Z]/)
    .withMessage("The password needs at least one alpha character")
    .matches(/[0-9]/)
    .withMessage("The password needs at least one numeric character")
    .isLength({ min: 4 })
    .withMessage("The password must be at least 4 characters long")
    // matches() natively checks if the specific character is present at least one time, so we don't need to specify '+' regex modifier
    .matches(/[^A-Za-z0-9]/)
    .withMessage("The password must be only made of alphanumeric chars"),
];

export const signUnpValidations = [
  body("username")
    .trim()
    .isAlpha()
    .withMessage("Username must contain only letters")
    .isLength({ min: 4, max: 10 })
    .withMessage("Username must be between 4 and 10 characters"),

  body("email", "Email in incorrect format")
    .trim()
    .isEmail()
    .custom(async (value, { req }) => {
      const email = await prisma.user.findUnique({
        where: {
          email: value,
        },
      });

      if (email) throw new Error("Email already exists!");
      return true;
    })
    .normalizeEmail(),

  body("password")
    .matches(/[A-Z]/)
    .withMessage("The password needs at least one alpha character")
    .matches(/[0-9]/)
    .withMessage("The password needs at least one numeric character")
    .isLength({ min: 4 })
    .withMessage("The password must be at least 4 characters long")
    // matches() natively checks if the specific character is present at least one time, so we don't need to specify '+' regex modifier
    .matches(/[^A-Za-z0-9]/)
    .withMessage("The password must be only made of alphanumeric chars"),

  body("confirm_password").custom(async (password, { req }) => {
    if (req.body.confirm_password !== password) {
      throw new Error("Passwords don't correspond!");
    }
    return true;
  }),
];
