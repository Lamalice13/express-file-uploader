import { prisma } from "../lib/prisma.js";
import path from "node:path";

export async function postFile(req, res, next) {
  console.log(req.files);

  const folders = [].concat(req.body.folders);
  if (req.files.length > 0) {
    try {
      await Promise.all(
        req.files.map((file) =>
          prisma.file.create({
            data: {
              bytes: file.size,
              original_name: file.originalname,
              public_id: file.filename,
              // file_type: ADD FILE TYPE ,
              path: file.path,
              folders: {
                connect: folders.map((id) => ({ id: parseInt(id) })),
              },
            },
          }),
        ),
      );
    } catch (err) {
      next(err);
    }
    return res.redirect("/home");
  } else {
    // PLEASE FACTOR
    return res.send("You need to put a file!");
  }
}

export async function downloadFile(req, res, next) {
  try {
    const file = await prisma.file.findUnique({
      where: { id: Number(req.params.id) },
      select: { public_id: true, original_name: true },
    });

    if (!file) return res.sendStatus(404);

    const resource_type = file.original_name.endsWith(".svg") ? "raw" : "image";
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    // Retrieve file extension
    const ext = path.extname(file.original_name);
    // Retrieve last portion after the last "/" with the 'suffix' parameter to remove
    const filename = path.basename(file.original_name, ext);
    const url = `https://res.cloudinary.com/${cloudName}/${resource_type}/upload/fl_attachment:${filename}/${file.public_id}`;
    return res.redirect(url);
  } catch (e) {
    next(e);
  }
}
