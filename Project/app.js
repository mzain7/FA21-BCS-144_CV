import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import session from "express-session";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import ejsMate from "ejs-mate";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.routes.js";
import { checkUser } from "./utils/user.js";

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));

// Initialize express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.use(express.static( 'public'));

app.use(checkUser);

app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

app.get("/about", (req, res) => {
  res.render("about", { user: req.user });
});

app.use("/user", userRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});


