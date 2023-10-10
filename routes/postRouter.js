import { Router } from "express";
import { postValidator } from "../validation.js";
import PostController from "../controllers/PostController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = new Router();
const controller = new PostController();

router.post('/create-post', authMiddleware, postValidator, controller.createPost);
router.patch('/update-post/:id', authMiddleware, postValidator, controller.updatePost);
router.delete('/:id', authMiddleware, controller.deletePost);
router.get('/', controller.getPosts);
router.get('/:id', controller.getPost);

export default router;