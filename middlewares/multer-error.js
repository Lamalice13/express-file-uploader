import parser from "../middlewares/cloudinary-multer.js";

export function multerError(req, res, next) {
  const uploadHandler = parser.array("file", 4);

  uploadHandler(req, res, async (err) => {
    try {
      // Handle Multer errors
      if (err) {
        if (err instanceof multer.MulterError) {
          const errorMap = {
            LIMIT_FILE_SIZE: {
              status: 413,
              message: "File exceeds 5MB limit",
            },
            LIMIT_FILE_TYPE: {
              status: 415,
              message: "Only JPEG/PNG files allowed",
            },
            LIMIT_UNEXPECTED_FILE: {
              status: 400,
              message: "Unexpected file field",
            },
          };

          const errorInfo = errorMap[err.code] || {
            status: 400,
            message: "File upload error",
          };

          return res.status(errorInfo.status).json({
            success: false,
            error: err.code,
            message: errorInfo.message,
          });
        }
        // Non-Multer errors
        throw err;
      }

      // Check if file exists
      if (!req.files || req.files.length === 0) {
        return res.redirect(
          `/home?error=${encodeURIComponent("No file was uploaded")}`,
        );
      }

      // Successful upload processing
      next();
    } catch (error) {
      console.error("Upload error:", error);
      next(error);
    }
  });
}
