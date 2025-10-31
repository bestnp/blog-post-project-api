import { Router } from 'express';
import assignmentsRouter from './assignments';
import profilesRouter from './profiles';
import healthRouter from './health';
import authRouter from './auth';

const router = Router();

// Mount routes
router.use('/auth', authRouter);
router.use('/assignments', assignmentsRouter);
router.use('/profiles', profilesRouter);
router.use('/health', healthRouter);

export default router;

