import express from "express";
import "dotenv/config";
import "./config/passport.js";
import bcrypt from "bcryptjs";
import passport from "passport";
import expressSession from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { prisma } from "./lib/prisma.js";
import uploadMiddleware from "./middlewares/cloudinary-multer.js";
import { v2 as cloudinary } from "cloudinary";

const app = express();

// CONFIG
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("views", "./views");
app.set("view engine", "ejs");

// SESSION
app.use(
  expressSession({
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // ms
    secret: process.env.SECRET_CODE,
    saveUninitialized: false,
    resave: false,
    // express session management via Prisma's database client.
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);

// PASSPORT
// Retrieve user at every request via deserializeUser()
app.use(passport.session());

// ROUTES

// Log in
app
  .route("/login")
  .get((req, res) => {
    if (req.isAuthenticated()) return res.redirect("/");
    return res.render("login");
  })
  .post((req, res) => {
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
    });
  });

// Sign up
app
  .route("/signup")
  .get((req, res) => {
    if (req.isAuthenticated()) return res.redirect("/");
    res.render("signup");
  })
  .post(async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const user = await prisma.user.create({
        data: {
          username: username,
          email: email,
          password: await bcrypt.hash(password, 10),
        },
        select: {
          id: true,
          username: true,
          email: true,
          password: true,
        },
      });
      // calls serializeUser(), populate req.session + req.user
      req.login(user, (e) => {
        if (e) return next(e);
        return res.redirect("/");
      });
    } catch (e) {
      next(e);
    }
  });

// GET + POST FILES
app
  .route("/")
  .get(async (req, res) => {
    if (!req.isAuthenticated()) return res.render("login");
    try {
      const folders = await prisma.folder.findMany({
        where: {
          userId: req.user.id,
        },
      });
      res.render("index", {
        folders,
      });
    } catch (err) {
      next(err);
    }
  })
  .post(uploadMiddleware, async (req, res, next) => {
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
      return res.redirect("/");
    } else {
      return res.send("You need to put a file!");
    }
  });

// GET FOLDER DETAILS
app.get("/folder/:id", async (req, res) => {
  const files = await prisma.file.findMany({
    where: {
      folders: {
        some: { id: parseInt(req.params.id) },
      },
    },
  });
  res.render("folder", {
    files,
  });
});

// DL FOLDER
app.get("/download/:id", async (req, res, next) => {
  try {
    const { path } = await prisma.file.findUnique({
      where: { id: parseInt(req.params.id) },
      select: { path: true },
    });
    res.download(`${path}`, (err) => {
      if (err) {
        console.error("File download failed:", err);
      } else {
        console.log("File downloaded successfully.");
      }
    });
  } catch (e) {
    next(e);
  }
});

// DELETE FOLDER ON DB
// DELETE MATCHING FILES ON CLOUDINARY
app.delete("/folders/:id", async (req, res, next) => {
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

    if (!folder) return res.sendStatus(404);

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
});

// CREATE FOLDER
app.post("/create/folder", async (req, res, next) => {
  try {
    await prisma.folder.create({
      data: {
        name: req.body.folder_name,
        userId: req.user.id,
      },
    });
    return res.redirect("/");
  } catch (err) {
    next(err);
  }
});

// PATCH NAME FOLDER
app.patch("/update/folder/:id", async (req, res, next) => {
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
});

// ERROR EXPRESS MIDDLEWARE
app.use((err, req, res, next) => {
  console.error("Express error", err);
  res.status(500).send(err);
});

// PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, (e) => {
  if (e) return console.log(e);
  console.log(`Server running on ${PORT}`);
});

// PACH NAME
