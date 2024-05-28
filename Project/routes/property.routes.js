import express from "express";
import {
  createProperty,
  deleteProperty,
  getProperties,
  renderCreateProperty,
  renderProperty,
  renderUpdateProperty,
  updateProperty,
} from "../controllers/property.controller.js";
import { verifyUser } from "../utils/user.js";

const router = express.Router();

router.get("/search", getProperties);
router.route("/create-property").get(verifyUser, renderCreateProperty).post(verifyUser, createProperty)
router.route("/update-property/:id").get(verifyUser, renderUpdateProperty).put(verifyUser, updateProperty);
router.get("/:id", renderProperty);
router.route("/:id").get(renderProperty).delete(verifyUser, deleteProperty);


export default router;
