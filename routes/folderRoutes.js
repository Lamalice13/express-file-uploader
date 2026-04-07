import { Router } from "express";
import {
  postFoler,
  getFolderDetails,
  patchFolder,
  deleteFolder,
  getShareForm,
  getShareLink,
} from "../controllers/folderController.js";
import {
  folderPatchValidations,
  folderCreateValidations,
} from "../middlewares/validations/folderValidations.js";

const folderRouter = Router();

folderRouter.post("/create", folderCreateValidations, postFoler);
folderRouter.get("/:id/share/form", getShareForm);
folderRouter.get("/:id/share", getShareLink);
folderRouter
  .route("/:id")
  .get(getFolderDetails)
  .patch(folderPatchValidations, patchFolder)
  .delete(deleteFolder);

export default folderRouter;
