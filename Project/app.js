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
import propertyRoutes from "./routes/property.routes.js";
import { checkUser } from "./utils/user.js";
import { findProperties } from "./controllers/property.controller.js";

dotenv.config();

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
app.use(express.static("public"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(checkUser);

app.get("/", async (req, res) => {
  const [offerProperties, rentProperties, saleProperties] = await Promise.all([
    findProperties(null, true),
    findProperties("rent", null),
    findProperties("sale", null),
  ]);
  res.render("home", {
    user: req.user,
    offerProperties,
    rentProperties,
    saleProperties,
  });
});

app.get("/about", (req, res) => {
  res.render("about", { user: req.user });
});

app.get("/contact", (req, res) => {
  res.render("contact", { user: req.user });
});

app.use("/user", userRoutes);
app.use("/property", propertyRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(500).json({ success: false, message, statusCode });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
