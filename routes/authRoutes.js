import { Router } from "express";
import {
  getLoginPage,
  login,
  getRegisterPage,
  register,
} from "../controllers/authController.js";

const authRouter = Router();

authRouter.route("/").get(getLoginPage).post(login);
authRouter.route("/signup").get(getRegisterPage).post(register);

export default authRouter;
