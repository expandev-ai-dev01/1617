import { Router } from 'express';
import * as taskController from '@/api/v1/internal/task/controller';

const router = Router();

router.post('/', taskController.postHandler);

export default router;
