import express from "express";
import { login } from "../controllers/auth.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.post("/login",verifyToken, login);

export default router
