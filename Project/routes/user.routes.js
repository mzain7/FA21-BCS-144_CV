import express from "express";
import {
  signup,
  login,
  logout,
  renderLogin,
  renderSignup,
} from "../controllers/user.controller.js";

const router = express.Router();

router.route("/sign-in").get(renderLogin).post(login);
router.route("/sign-up").get(renderSignup).post(signup);
router.get("/logout", logout);

export default router;
