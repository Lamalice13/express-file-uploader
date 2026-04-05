import { Router } from "express";
import {
  getLoginPage,
  login,
  getRegisterPage,
  register,
  logout,
} from "../controllers/authController.js";
import {
  signInValidations,
  signUpValidations,
} from "../middlewares/validations/authValidations.js";

const authRouter = Router();

authRouter.get("/", getLoginPage);
authRouter.post("/login", signInValidations, login);
authRouter.post("/logout", logout);
authRouter
  .route("/signup")
  .get(getRegisterPage)
  .post(signUpValidations, register);

export default authRouter;
