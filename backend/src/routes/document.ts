import { Router } from 'express';
import * as docController from '../controllers/document.controller.js';

const router = Router();

router.get('/', docController.getDocuments);
router.post('/', docController.createDocument);
router.get('/:id', docController.getDocument);
router.put('/:id', docController.updateDocument);
router.delete('/:id', docController.deleteDocument);

export default router;