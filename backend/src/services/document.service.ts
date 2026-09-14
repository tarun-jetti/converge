import { prisma } from '../lib/prisma.js';

export class DocumentService {
  // 1. List all accessible documents (Owned OR Collaborated)
  async getUserDocuments(userId: string) {
    return await prisma.document.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { collaborators: { some: { id: userId } } },
        ],
      },
      include: {
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

  // 2. Create a new document
  async createDocument(userId: string, title?: string) {
    return await prisma.document.create({
      data: {
        title: title || 'Untitled Document',
        ownerId: userId,
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
      },
    });
  }

  // 3. Get document by ID with access check
  async getDocumentById(userId: string, documentId: string) {
    const doc = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        owner: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        collaborators: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
      },
    });

    if (!doc) {
      throw new Error('DOCUMENT_NOT_FOUND');
    }

    // Access check: Must be owner or collaborator
    const isOwner = doc.ownerId === userId;
    const isCollaborator = doc.collaborators.some((c) => c.id === userId);

    if (!isOwner && !isCollaborator) {
      throw new Error('FORBIDDEN');
    }

    return doc;
  }

  // 4. Update document title (Owner Only)
  async updateDocument(userId: string, documentId: string, title?: string) {
    const doc = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!doc) {
      throw new Error('DOCUMENT_NOT_FOUND');
    }

    if (doc.ownerId !== userId) {
      throw new Error('FORBIDDEN');
    }

    return await prisma.document.update({
      where: { id: documentId },
      data: {
        title: title ?? doc.title,
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        collaborators: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
      },
    });
  }

  // 5. Delete document (Owner Only)
  async deleteDocument(userId: string, documentId: string) {
    const doc = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!doc) {
      throw new Error('DOCUMENT_NOT_FOUND');
    }

    if (doc.ownerId !== userId) {
      throw new Error('FORBIDDEN');
    }

    await prisma.document.delete({
      where: { id: documentId },
    });

    return { success: true };
  }
}

export const documentService = new DocumentService();