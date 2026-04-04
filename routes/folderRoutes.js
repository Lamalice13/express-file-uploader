import { Router } from "express";
import {
  postFoler,
  getFolderDetails,
  patchFolder,
  deleteFolder,
} from "../controllers/folderController.js";
import {
  folderPatchValidations,
  folderCreateValidations,
} from "../middlewares/validations/folderValidations.js";

const folderRouter = Router();

folderRouter.post("/create", folderCreateValidations, postFoler);
folderRouter
  .route("/:id")
  .get(getFolderDetails)
  .patch(folderPatchValidations, patchFolder)
  .delete(deleteFolder);

export default folderRouter;
