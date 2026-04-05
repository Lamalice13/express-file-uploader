import { body } from "express-validator";
import { prisma } from "../../lib/prisma.js";

const passwordValidation = () =>
  body("password")
    .matches(/[A-Z]/)
    .withMessage("The password needs at least one uppercase character")
    .bail({ level: "request" })
    .matches(/[0-9]/)
    .withMessage("The password needs at least one numeric character")
    .bail({ level: "request" })
    .isLength({ min: 4 })
    .withMessage("The password must be at least 4 characters long")
    .bail({ level: "request" })
    // matches() natively checks if the specific character is present at least one time, so we don't need to specify '+' regex modifier
    .matches(/[^A-Za-z0-9]/)
    .withMessage("The password must only contain alphanumeric characters");

export const signInValidations = [
  body("username")
    .trim()
    .isLength({ min: 4, max: 10 })
    .withMessage("Username must be between 4 and 10 characters")
    .bail({ level: "request" })
    .isAlpha()
    .withMessage("Username must contain only letters"),
  passwordValidation(),
];

export const signUpValidations = [
  body("username")
    .trim()
    .isAlpha()
    .withMessage("Username must contain only letters")
    .bail({ level: "request" })
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

  passwordValidation(),
  body("confirm_password").custom(async (value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords don't correspond!");
    }
    return true;
  }),
];
