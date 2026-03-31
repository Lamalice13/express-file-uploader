import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(
      null,
      file.originalname.split(".")[0] + "-" + uniqueSuffix + fileExtension,
    );
  },
});
const upload = multer({ storage: storage });

const uploadMiddleware = upload.any();

export default uploadMiddleware;
