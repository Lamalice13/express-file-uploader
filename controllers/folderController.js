import { matchedData, validationResult } from "express-validator";
import { prisma } from "../lib/prisma.js";
import { v2 as cloudinary } from "cloudinary";

export async function postFoler(req, res, next) {
  const errors = validationResult(req);
  const folders = await prisma.folder.findMany({
    where: { userId: req.user.id },
  });
  if (!errors.isEmpty()) {
    return res.render("index", {
      errors: errors.array(),
      folders,
    });
  }
  try {
    const { folder_name } = matchedData(req);

    await prisma.folder.create({
      data: {
        name: folder_name,
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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { folderName } = matchedData(req);
    await prisma.folder.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name: folderName,
      },
    });
    return res
      .status(200)
      .json({ success: true, msg: "Folder successfully updated!" });
  } catch (e) {
    next(e);
  }
}

export function getShareForm(req, res, next) {
  const { id } = req.params;
  res.render("shareForm", {
    id,
  });
}

export function getShareLink(req, res) {
  const { link_duration } = req.query;
  const { id } = req.params;

  console.log(id);

  const duration = link_duration * 24;
  const date = Date.now();

  const shareLink = `http://localhost:3000/${id}/share/${date}-${duration}`;
  res.render("shareForm", {
    shareLink,
    id,
  });
}
