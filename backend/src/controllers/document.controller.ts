import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { documentService } from '../services/document.service.js';
import { z } from 'zod';

const documentSchema = z.object({
  title: z.string().trim().max(100, { message: 'Title must be at most 100 characters' }).optional(),
});

// Helper to safely extract string ID from params
function getParamId(params: any): string {
  return Array.isArray(params.id) ? params.id[0] : params.id;
}

export async function getDocuments(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const documents = await documentService.getUserDocuments(userId);
    res.json({ documents });
  } catch (error) {
    console.error('[Get Documents Error]:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
}

export async function createDocument(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const validation = documentSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: validation.error.flatten().fieldErrors,
      });
      return;
    }

    const userId = req.user!.userId;
    const document = await documentService.createDocument(userId, validation.data.title);

    res.status(201).json({
      message: 'Document created successfully',
      document,
    });
  } catch (error) {
    console.error('[Create Document Error]:', error);
    res.status(500).json({ error: 'Failed to create document' });
  }
}

export async function getDocument(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const id = getParamId(req.params);
    const userId = req.user!.userId;

    const document = await documentService.getDocumentById(userId, id);
    res.json({ document });
  } catch (error: any) {
    if (error.message === 'DOCUMENT_NOT_FOUND') {
      res.status(404).json({ error: 'Document not found' });
      return;
    }
    if (error.message === 'FORBIDDEN') {
      res.status(403).json({ error: 'Access denied to this document' });
      return;
    }

    console.error('[Get Document Error]:', error);
    res.status(500).json({ error: 'Failed to fetch document' });
  }
}

export async function updateDocument(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const id = getParamId(req.params);
    const userId = req.user!.userId;

    const validation = documentSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: validation.error.flatten().fieldErrors,
      });
      return;
    }

    const document = await documentService.updateDocument(userId, id, validation.data.title);
    res.json({ message: 'Document updated successfully', document });
  } catch (error: any) {
    if (error.message === 'DOCUMENT_NOT_FOUND') {
      res.status(404).json({ error: 'Document not found' });
      return;
    }
    if (error.message === 'FORBIDDEN') {
      res.status(403).json({ error: 'Only the owner can update this document' });
      return;
    }

    console.error('[Update Document Error]:', error);
    res.status(500).json({ error: 'Failed to update document' });
  }
}

export async function deleteDocument(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const id = getParamId(req.params);
    const userId = req.user!.userId;

    await documentService.deleteDocument(userId, id);
    res.json({ message: 'Document deleted successfully' });
  } catch (error: any) {
    if (error.message === 'DOCUMENT_NOT_FOUND') {
      res.status(404).json({ error: 'Document not found' });
      return;
    }
    if (error.message === 'FORBIDDEN') {
      res.status(403).json({ error: 'Only the owner can delete this document' });
      return;
    }

    console.error('[Delete Document Error]:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
}