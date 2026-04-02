import { prisma } from "../lib/prisma.js";
import { v2 as cloudinary } from "cloudinary";

export async function postFoler(req, res, next) {
  try {
    await prisma.folder.create({
      data: {
        name: req.body.folder_name,
        userId: req.user.id,
      },
    });
    return res.redirect("/home");
  } catch (err) {
    next(err);
  }
}

export async function getFolderDetails(req, res, next) {
  try {
    const files = await prisma.file.findMany({
      where: {
        folders: {
          some: { id: parseInt(req.params.id) },
        },
      },
    });
    return res.render("folder", {
      files,
    });
  } catch (e) {
    next(e);
  }
}

export async function deleteFolder(req, res, next) {
  try {
    const folderId = parseInt(req.params.id);

    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: {
        files: {
          include: {
            folders: true,
          },
        },
      },
    });

    const filesToDelete = folder.files
      .filter((file) => file.folders.length === 1)
      .map((file) => file.id);

    if (filesToDelete.length > 0) {
      const files = await prisma.file.findMany({
        where: {
          id: { in: filesToDelete },
        },
        select: {
          original_name: true,
          public_id: true,
        },
      });

      await Promise.all(
        files.map(async (file) => {
          const isSvg = file.original_name.endsWith(".svg");

          await cloudinary.uploader.destroy(file.public_id, {
            resource_type: isSvg ? "raw" : "image",
          });
        }),
      );

      await prisma.file.deleteMany({
        where: {
          id: { in: filesToDelete },
        },
      });
    }

    await prisma.folder.delete({
      where: { id: folderId },
    });

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
}

export async function patchFolder(req, res, next) {
  try {
    await prisma.folder.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name: req.body.folderName,
      },
    });
  } catch (e) {
    next(e);
  }
}
