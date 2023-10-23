import express from "express";
import verifyToken from "../middleware/auth.js";
import { getUser, getUserFriends } from "../controllers/user.js";

const router = express.Router();

// READ
router.get("/:id", verifyToken, getUser);
router.get("/:id/fri", verifyToken, getUserFriends);
export default router;
