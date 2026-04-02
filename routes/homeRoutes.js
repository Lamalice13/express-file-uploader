import { Router } from "express";
import { getHome } from "../controllers/homeController.js";

const homeRouter = Router();

homeRouter.get("/", getHome);

export default homeRouter;
