import { z } from 'zod';

export const createDocumentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'Title cannot be empty' })
    .max(120, { message: 'Title cannot exceed 120 characters' })
    .optional(),
});

export const updateDocumentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'Title cannot be empty' })
    .max(120, { message: 'Title cannot exceed 120 characters' }),
});

export const documentIdParamSchema = z.object({
  id: z.string().uuid({ message: 'Invalid document UUID format' }),
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
export type DocumentIdParam = z.infer<typeof documentIdParamSchema>;
