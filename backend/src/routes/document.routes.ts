import { Router } from 'express';
import * as docController from '../controllers/document.controller.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import {
  createDocumentSchema,
  updateDocumentSchema,
  documentIdParamSchema,
} from '../schemas/document.js';

const router = Router();

// Global auth enforcement across all document endpoints
router.use(requireAuth);

router.get(
  '/',
  docController.list
);

router.post(
  '/',
  validate({ body: createDocumentSchema }),
  docController.create
);

router.get(
  '/:id',
  validate({ params: documentIdParamSchema }),
  docController.get
);

router.patch(
  '/:id',
  validate({ params: documentIdParamSchema, body: updateDocumentSchema }),
  docController.updateTitle
);

router.delete(
  '/:id',
  validate({ params: documentIdParamSchema }),
  docController.deleteDoc
);

export default router;
