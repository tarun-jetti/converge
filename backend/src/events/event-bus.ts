import { EventEmitter } from 'events';

export type EventMap = {
  'user.registered': { userId: string; email: string; name?: string | null };
  'document.created': { documentId: string; ownerId: string; title: string };
  'document.deleted': { documentId: string; ownerId: string };
};

class TypedEventEmitter extends EventEmitter {
  emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): boolean {
    return super.emit(event, payload);
  }

  on<K extends keyof EventMap>(event: K, listener: (payload: EventMap[K]) => void): this {
    return super.on(event, listener);
  }
}

export const eventBus = new TypedEventEmitter();
