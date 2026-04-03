import { Router } from "express";
import { postFile, downloadFile } from "../controllers/fileController.js";
import { multerError } from "../middlewares/multer-error.js";

const fileRouter = Router();

fileRouter.post("/create", multerError, postFile);
fileRouter.get("/:id/download", downloadFile);

export default fileRouter;
