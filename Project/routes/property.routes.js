import express from "express";


const router = express.Router();


router.get("/", getProperties);


export default router;