import express from 'express';
import { getProfile } from '../controllers/userController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/me', authenticate, getProfile);

export default router;