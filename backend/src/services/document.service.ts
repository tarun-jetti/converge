import { prisma } from '../lib/prisma.js';
import { AppError } from '../lib/errors.js';
import { eventBus } from '../events/event-bus.js';

export class DocumentService {
  // 1. List accessible documents (Owned OR Collaborated)
  async getUserDocuments(userId: string) {
    return await prisma.document.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { collaborators: { some: { id: userId } } },
        ],
      },
      select: {
        id: true,
        title: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        collaborators: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  // 2. Create document & emit event
  async createDocument(userId: string, title?: string) {
    const documentTitle = title || 'Untitled Document';

    const doc = await prisma.document.create({
      data: {
        title: documentTitle,
        ownerId: userId,
      },
      select: {
        id: true,
        title: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
      },
    });

    // Fire side effect event: automatically attaches owner as collaborator in event handler
    eventBus.emit('document.created', {
      documentId: doc.id,
      ownerId: userId,
      title: doc.title,
    });

    return doc;
  }

  // 3. Get document metadata with ACL verification
  async getDocumentById(userId: string, documentId: string) {
    const doc = await prisma.document.findUnique({
      where: { id: documentId },
      select: {
        id: true,
        title: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        collaborators: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
      },
    });

    if (!doc) {
      throw new AppError('Document not found', 404, 'DOCUMENT_NOT_FOUND');
    }

    const isOwner = doc.ownerId === userId;
    const isCollaborator = doc.collaborators.some((c) => c.id === userId);

    if (!isOwner && !isCollaborator) {
      throw new AppError('Access denied to this document', 403, 'FORBIDDEN');
    }

    return doc;
  }

  // 4. Update document title (Owner Only)
  async updateDocument(userId: string, documentId: string, title: string) {
    const doc = await prisma.document.findUnique({
      where: { id: documentId },
      select: { id: true, ownerId: true },
    });

    if (!doc) {
      throw new AppError('Document not found', 404, 'DOCUMENT_NOT_FOUND');
    }

    if (doc.ownerId !== userId) {
      throw new AppError('Only the document owner can rename this document', 403, 'FORBIDDEN');
    }

    return await prisma.document.update({
      where: { id: documentId },
      data: { title },
      select: {
        id: true,
        title: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
      },
    });
  }

  // 5. Delete document (Owner Only) & emit event
  async deleteDocument(userId: string, documentId: string) {
    const doc = await prisma.document.findUnique({
      where: { id: documentId },
      select: { id: true, ownerId: true },
    });

    if (!doc) {
      throw new AppError('Document not found', 404, 'DOCUMENT_NOT_FOUND');
    }

    if (doc.ownerId !== userId) {
      throw new AppError('Only the document owner can delete this document', 403, 'FORBIDDEN');
    }

    await prisma.document.delete({
      where: { id: documentId },
    });

    eventBus.emit('document.deleted', {
      documentId,
      ownerId: userId,
    });

    return { success: true };
  }
}

export const documentService = new DocumentService();
