import { Router } from 'express';
import multer from 'multer';
import { contactController } from './contacts.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { auditLog } from '../../middlewares/auditLog.middleware';
import { createContactSchema, updateContactSchema, bulkDeleteSchema } from './contacts.schemas';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Contacts endpoints (some can be accessed with auth or fallback)
router.use(authenticate);

router.get('/', contactController.getContacts);
router.get('/export', auditLog('contacts_exported', 'Contact'), contactController.exportContacts);
router.post('/import', upload.single('file'), auditLog('contacts_imported', 'Contact'), contactController.importContacts);
router.post('/bulk-delete', validate(bulkDeleteSchema), auditLog('contacts_bulk_deleted', 'Contact'), contactController.bulkDelete);

router.get('/:id', contactController.getContactById);
router.get('/:id/timeline', contactController.getTimeline);

router.post(
  '/',
  validate(createContactSchema),
  auditLog('contact_created', 'Contact'),
  contactController.createContact
);

router.patch(
  '/:id',
  validate(updateContactSchema),
  auditLog('contact_updated', 'Contact'),
  contactController.updateContact
);

router.delete(
  '/:id',
  auditLog('contact_deleted', 'Contact'),
  contactController.deleteContact
);

export default router;
