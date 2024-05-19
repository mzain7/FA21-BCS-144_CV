import jwt from "jsonwebtoken";

export const verifyUser = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json("You need to login first");
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(401).json("You need to login first");
    }
    req.user = decodedToken;
    next();
  });
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
