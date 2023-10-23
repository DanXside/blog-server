import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { commentValidator } from "../validation.js";
import CommentController from "../controllers/CommentController.js";

const router = new Router();
const controller = new CommentController();

router.post('/', authMiddleware, commentValidator, controller.createComment);
router.get('/comms', authMiddleware, controller.getComments);
router.get('/comm-count', authMiddleware, controller.getCommentCount);

export default router;
