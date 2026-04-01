import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max par fichier
  },

  params: async (req, file) => {
    return {
      folder: "file_uploader",
      resource_type: file.mimetype === "image/svg+xml" ? "raw" : "auto",
      unique_filename: true,
      public_id: file.filename,
    };
  },
});

const parser = multer({ storage: storage });

export default parser;
