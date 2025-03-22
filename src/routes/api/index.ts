import { Router } from 'express';
import { userRouter } from './userRoutes.js';
import { thoughtRouter } from './thoughtRoutes.js';

const router = Router();

router.use('/courses', courseRouter);
router.use('/students', studentRouter);

export default router;
