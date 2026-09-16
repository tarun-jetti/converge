import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { documentService } from '../services/document.service.js';

export async function list(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const documents = await documentService.getUserDocuments(req.user!.userId);
    res.status(200).json({ documents });
  } catch (error) {
    next(error);
  }
}

export async function create(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const document = await documentService.createDocument(
      req.user!.userId,
      req.body.title
    );
    res.status(201).json({
      message: 'Document created successfully',
      document,
    });
  } catch (error) {
    next(error);
  }
}

export async function get(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const document = await documentService.getDocumentById(
      req.user!.userId,
      req.params.id as string
    );
    res.status(200).json({ document });
  } catch (error) {
    next(error);
  }
}

export async function updateTitle(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const document = await documentService.updateDocument(
      req.user!.userId,
      req.params.id as string,
      req.body.title
    );
    res.status(200).json({
      message: 'Document updated successfully',
      document,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteDoc(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await documentService.deleteDocument(req.user!.userId, req.params.id as string);
    res.status(200).json({
      message: 'Document deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}
