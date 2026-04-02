import { Router } from "express";
import parser from "../middlewares/cloudinary-multer.js";
import { postFile, downloadFile } from "../controllers/fileController.js";

const fileRouter = Router();

fileRouter.post("/create", parser.array("file", 4), postFile);
fileRouter.get("/:id/download", downloadFile);

export default fileRouter;
