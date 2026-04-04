import { Router } from "express";
import {
  getLoginPage,
  login,
  getRegisterPage,
  register,
  logout,
} from "../controllers/authController.js";

const authRouter = Router();

authRouter.get("/", getLoginPage);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.route("/signup").get(getRegisterPage).post(register);

export default authRouter;
