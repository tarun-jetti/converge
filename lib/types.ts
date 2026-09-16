export interface User {
  id: string;
  email: string;
  name?: string | null;
  createdAt?: string;
}

export interface DocumentCollaborator {
  id: string;
  documentId: string;
  userId: string;
  role: 'owner' | 'editor' | 'viewer';
  user?: {
    id: string;
    email: string;
    name?: string | null;
  };
}

export interface DocumentItem {
  id: string;
  title: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  collaborators?: DocumentCollaborator[];
}

export interface AuthResponse {
  message?: string;
  token: string;
  user: User;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface TemplateItem {
  id: string;
  name: string;
  description: string;
  defaultTitle: string;
  category: string;
  badge?: string;
}
