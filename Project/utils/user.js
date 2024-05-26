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
  if (!req.session.userId) {
    return res.render("users/login", { user: null });
  }

  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.render("users/login", { user: null });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.render("users/login", { user: null });
  }
};






export const checkUser = (req, res, next) => {
  req.user = null;
  const token = req.cookies.access_token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (!err) {
        req.user = decodedToken;
      }
    });
  }
  next();
};
