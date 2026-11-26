import { Router } from 'express';
import { searchController } from './search.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', searchController.search);

export default router;
