import { body } from "express-validator";

export const folderPatchValidations = [
  body("folderName")
    .trim()
    .isLength({ min: 5, max: 15 })
    .withMessage("Folder name must be between 5 and 15 characters")
    .isAlpha()
    .withMessage("Folder name must contain only alpha characters"),
];

export const folderCreateValidations = [
  body("folder_name")
    .trim()
    .isLength({ min: 5, max: 15 })
    .withMessage("f")
    .isAlpha()
    .withMessage("Folder name must contain only alpha characters"),
];
