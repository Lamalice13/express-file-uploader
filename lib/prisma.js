import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import expressSession from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

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
  })
);

export { prisma };
