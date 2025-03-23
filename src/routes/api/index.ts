import { Router } from 'express';
import { userRouter } from './userRoutes.js';
import { thoughtRouter } from './thoughtRoutes.js';

const router = Router();

router.use('/users', userRouter);
router.use('/thought', thoughtRouter);

export default router;
