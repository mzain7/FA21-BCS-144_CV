import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyUser = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.render("users/login", { user: null });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.render("users/login", { user: null });
    }
    req.user = decodedToken;
    next();
  });
};

const verifySessionUser = async (req, res, next) => {
  if (!req.session.user) {
    return res.render("users/login", { user: null });
  }

  req.user = req.session.user;
  next();
};

export const checkUser = (req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user;
  } else {
    res.locals.user = null;
  }
  next();
};
