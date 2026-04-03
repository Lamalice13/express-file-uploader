import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { fileFilter } from "../middlewares/file-filter.js";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "file_uploader",
      resource_type: "auto",
      unique_filename: true,
      public_id: file.filename,
    };
  },
});

const parser = multer({
  storage: storage,
  limits: {
    files: 4,
    fileSize: 5 * 1024 * 1024, // 5 MB max par fichier
  },
  fileFilter,
});

export default parser;
