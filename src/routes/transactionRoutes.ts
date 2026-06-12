import { Router } from 'express';
import { deposits, transfers, getTransactions, getBalance } from '../controllers/transactionController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/deposits', authenticate, deposits)
router.post('/transfers', authenticate, transfers);
router.get('/', authenticate, getTransactions);
router.get('/balance', authenticate, getBalance);

export default router;