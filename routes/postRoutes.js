import express from "express";
import verifyToken from "../middleware/auth.js";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/post.js";

const router = express.Router();

// READ
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/", verifyToken, getUserPosts);

// UPDATE
router.patch("/:postId/like", verifyToken, likePost);

export default router;
