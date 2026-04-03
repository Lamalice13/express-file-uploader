import { fileTypeFromStream } from "file-type";
import { Readable } from "node:stream";

export async function fileFilter(req, file, cb) {
  const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

  try {
    // Convert file.stream Readable Stream object to a Web Readable Stream
    const stream = Readable.toWeb(req);
    // Detect the file type of a web ReadableStream
    const fileType = await fileTypeFromStream(stream);

    if (!fileType || !ALLOWED.includes(fileType.mime))
      return cb(new Error("Type de fichier non autorisé"), false);

    cb(null, true);
  } catch (e) {
    cb(e, false);
  }
}
