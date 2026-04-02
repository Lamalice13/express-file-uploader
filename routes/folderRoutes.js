import { Router } from "express";
import {
  postFoler,
  getFolderDetails,
  patchFolder,
  deleteFolder,
} from "../controllers/folderController.js";

const folderRouter = Router();

folderRouter.post("/create", postFoler);
folderRouter
  .route("/:id")
  .get(getFolderDetails)
  .patch(patchFolder)
  .delete(deleteFolder);

export default folderRouter;
