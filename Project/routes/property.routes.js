import express from "express";
import {
  deleteProperty,
  getProperties,
  renderProperty,
} from "../controllers/property.controller.js";
import { verifyUser } from "../utils/user.js";

const router = express.Router();

router.get("/search", getProperties);
router.get("/:id", renderProperty);
router.route("/:id").get(renderProperty).delete(verifyUser, deleteProperty);

export default router;
