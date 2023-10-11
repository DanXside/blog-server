import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { commentValidator } from "../validation.js";
import CommentController from "../controllers/CommentController.js";

const router = new Router();
const controller = new CommentController();

router.post('/:id', authMiddleware, commentValidator, controller.createComment);
router.get('/:id', authMiddleware, controller.getComments)

export default router;
