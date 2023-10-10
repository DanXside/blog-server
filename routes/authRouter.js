import { Router } from "express";
import { registrationValidator } from "../validation.js";
import UserController from "../controllers/UserController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = new Router();
const controller = new UserController();

router.post('/registration', registrationValidator, controller.registrationUser);
router.post('/login', controller.loginUser);
router.get('/me', authMiddleware, controller.getUser);

export default router;