import express from "express";
import "dotenv/config";
import passport from "passport";
import "./config/passport.js";
import { prisma } from "./lib/prisma.js";
import expressSession from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import fileRouter from "./routes/fileRoutes.js";
import authRouter from "./routes/authRoutes.js";
import folderRouter from "./routes/folderRoutes.js";
import homeRouter from "./routes/homeRoutes.js";
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

// Retrieve user at every request via deserializeUser()
app.use(passport.session());

// ROUTES
app.use("/", authRouter);
app.use("/home", homeRouter);
app.use("/folder", folderRouter);
app.use("/file", fileRouter);

// ERROR EXPRESS MIDDLEWARE
app.use(async (err, req, res, next) => {
  console.error("Express error", err);
  try {
    const folders = await prisma.folder.findMany({
      where: {
        userId: req.user.id,
      },
    });
    return res.status(500).render("index", {
      error: err.message || "Internal server error",
      folders,
    });
  } catch (err) {
    next(err);
  }
});

// PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, (e) => {
  if (e) return console.log(e);
  console.log(`Server running on ${PORT}`);
});
