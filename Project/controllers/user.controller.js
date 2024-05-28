import User from "../models/user.model.js";
import Property from "../models/property.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const renderSignup = (req, res) => {
  res.render("users/signup", { user: req.user });
};

export const renderLogin = (req, res) => {
  res.render("users/login", { user: req.user });
};

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json("Please fill in all fields");
  }
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json("New user created");
    console.log("New user created");
  } catch (error) {
    if (error.code === 11000) {
      let field = Object.keys(error.keyPattern)[0];
      res.status(400).json(`Duplicate ${field} error: ${field} already exists`);
    } else {
      res.status(400).json(error.message);
    }
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("Please fill in all fields");
  }
  const validUser = await User.findOne({ email });
  if (!validUser) {
    return res.status(400).json("Invalid email or password");
  }

  const validPassword = await bcryptjs.compare(password, validUser.password);

  if (!validPassword) {
    return res.status(400).json("Invalid email or password");
  }
  const token = jwt.sign(
    { id: validUser._id, pic: validUser.profilePicture },
    process.env.JWT_SECRET
  );
  req.session.userId = validUser._id;
  const { password: pass, ...user } = validUser._doc;
  res
    .cookie("access_token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    })
    .status(200)
    .json(user);
};

export const logout = (req, res) => {
  try {
    res.clearCookie("access_token").status(200).json("Logged out successfully");
    req.session.destroy();
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const renderProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.pic = user.profilePicture;
    const properties = (await Property.find({})) || [];
    res.render("users/profile", { user, properties });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, profilePicture, password } = req.body;
  if (req.user.id === id) {
    if (password) {
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: { username, email, profilePicture, password: hashedPassword } },
        { new: true }
      );
      const { password: pass, ...rest } = updatedUser._doc;
      res.status(200).json(rest);
    } else {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: { username, email, profilePicture } },
        { new: true }
      );
      res.status(200).json(updatedUser);
    }
  } else {
    res.status(403).json("You can update only your account");
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (req.user.id === id) {
    await User.findByIdAndDelete(id);
    res.clearCookie("access_token").status(200).json("User has been deleted");
  } else {
    res.status(403).json("You can delete only your account");
  }
};