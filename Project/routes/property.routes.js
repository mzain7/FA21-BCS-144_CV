import express from "express";
import { getProperties, renderProperty } from "../controllers/property.controller";


const router = express.Router();


router.get("/", getProperties);
router.get("/:id", renderProperty);



export default router;