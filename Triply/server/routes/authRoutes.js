import express from 'express';
import { signup, login, deleteUser } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.delete("/users/:id", authMiddleware, deleteUser);

export default router;