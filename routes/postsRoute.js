import express from "express";
var router = express.Router();

import {
    commentPost,
    createPosts,
    deleteComment,
    deletePost,
    getPost,
    getPosts,
    getPostsByCreator,
    getPostsBySearch,
    likePost,
    updateComment,
    updatePosts,
} from "../controllers/posts.js";
import { auth } from "../middleware/auth.js";

router.get("/search", getPostsBySearch);
router.get("/", getPosts);
router.get("/creator", getPostsByCreator);
router.get("/:id", getPost);
router.post("/", auth, createPosts);
router.patch(`/:id`, auth, updatePosts);
router.patch(`/:id/likePost`, auth, likePost);
router.post(`/:id/comment`, auth, commentPost);

router.patch(`/comment/:id`, auth, updateComment);
router.delete("/:id", auth, deletePost);
router.delete("/comment/:id", auth, deleteComment);

export default router;
