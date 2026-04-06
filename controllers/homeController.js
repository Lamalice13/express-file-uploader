import { prisma } from "../lib/prisma.js";

export async function getHome(req, res, next) {
  if (!req.isAuthenticated()) return res.render("login");
  try {
    const folders = await prisma.folder.findMany({
      where: {
        userId: req.user.id,
      },
    });
    return res.render("index", {
      folders,
      error: req.query.error || null,
      success: req.query.success || null,
    });
  } catch (err) {
    next(err);
  }
}
