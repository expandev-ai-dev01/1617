import { Router } from 'express';
import taskRoutes from './taskRoutes';

const router = Router();

// Internal authenticated routes will be added here
router.use('/task', taskRoutes);

export default router;
