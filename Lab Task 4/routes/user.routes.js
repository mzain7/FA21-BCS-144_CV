import express from "express";
import {
  signup,
  login,
  logout,
  renderLogin,
  renderSignup,
  renderProfile,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { verifyUser } from "../utils/user.js";

const router = express.Router();

router.route("/sign-in").get(renderLogin).post(login);
router.route("/sign-up").get(renderSignup).post(signup);
router.get("/logout", logout);
router.get("/profile", verifyUser, renderProfile);
router.route("/:id").put(verifyUser, updateUser).delete(verifyUser, deleteUser);

export default router;
