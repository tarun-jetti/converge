export interface UserProfile {
  id: string;
  name: string;
  avatarText: string;
  color: string;
  role: 'owner' | 'editor' | 'viewer';
}

export interface RemoteCursor {
  id: string;
  name: string;
  color: string;
  x: number; // percentage 0-100
  y: number; // pixels from top of canvas
  activeText?: string;
  lastUpdated: number;
}

export type ConnectionStatus = 'connected' | 'connecting' | 'offline';

export type PageLayoutMode = 'canvas' | 'paginated' | 'wide';

export interface ActiveEditorState {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrike: boolean;
  isCode: boolean;
  isLeft: boolean;
  isCenter: boolean;
  isRight: boolean;
  isBullet: boolean;
  isOrdered: boolean;
  isTaskList: boolean;
  isQuote: boolean;
  isTable: boolean;
  isLink: boolean;
}

export interface EditorStats {
  words: number;
  characters: number;
  readingTimeMinutes: number;
}

export interface TableOfContentsHeading {
  id: string;
  text: string;
  level: number;
  pos: number;
}
