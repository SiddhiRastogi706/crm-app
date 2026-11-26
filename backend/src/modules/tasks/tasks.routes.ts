import { Router } from 'express';
import { taskController } from './tasks.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { auditLog } from '../../middlewares/auditLog.middleware';
import { createTaskSchema, updateTaskSchema } from './tasks.schemas';

const router = Router();

router.use(authenticate);

router.get('/calendar', taskController.getCalendarEvents);
router.get('/', taskController.getTasks);

router.post(
  '/',
  validate(createTaskSchema),
  auditLog('task_created', 'Task'),
  taskController.createTask
);

router.patch(
  '/:id',
  validate(updateTaskSchema),
  auditLog('task_updated', 'Task'),
  taskController.updateTask
);

router.delete(
  '/:id',
  auditLog('task_deleted', 'Task'),
  taskController.deleteTask
);

export default router;
