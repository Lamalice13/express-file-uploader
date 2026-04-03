export function fileFilter(req, file, cb) {
  const allowedTypes = ["image/jpeg", "image/png"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new multer.MulterError("LIMIT_FILE_TYPE");
    cb(error, false);
  }
}
