import express from "express";
import "dotenv/config";
import "./config/passport";

const app = express();

// CONFIG
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("views", "./views");
app.set("view engine", "ejs");

// PASSPORT
// Retrieve user at every request via deserializeUser()
app.use(passport.session());

// ROUTES

// PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, (e) => {
  if (e) return console.log(e);
  console.log(`Server running on ${PORT}`);
});
