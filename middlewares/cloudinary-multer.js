import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "file_uploader",
    resource_type: "auto",
    unique_filename: true,
    use_filename: true,
  },
});

const parser = multer({ storage: storage });
const uploadMiddleware = parser.any();

export default uploadMiddleware;
