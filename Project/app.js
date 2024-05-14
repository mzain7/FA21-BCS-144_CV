const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const helmet = require("helmet");
const dotenv = require("dotenv");
const path = require("path");
const ejsMate = require("ejs-mate");
const cookieParser = require("cookie-parser");

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
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')))


app.get("/", (req, res) => {
  res.render("home");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});


