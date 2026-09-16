import { eventBus } from '../event-bus.js';
import { prisma } from '../../lib/prisma.js';

export function registerEventHandlers(): void {
  // 1. User registration side-effects
  eventBus.on('user.registered', (data) => {
    console.log(`[Event: user.registered] User registered: ${data.email} (${data.userId})`);
  });

  // 2. Document creation side-effects: attach owner as a collaborator
  eventBus.on('document.created', async (data) => {
    console.log(
      `[Event: document.created] Document created: "${data.title}" (${data.documentId}) by ${data.ownerId}`
    );
    try {
      await prisma.document.update({
        where: { id: data.documentId },
        data: {
          collaborators: {
            connect: { id: data.ownerId },
          },
        },
      });
      console.log(
        `[Event: document.created] Successfully attached owner ${data.ownerId} as collaborator to ${data.documentId}`
      );
    } catch (err) {
      console.error('[Event Error: document.created Failed to attach collaborator]:', err);
    }
  });

  // 3. Document deletion side-effects
  eventBus.on('document.deleted', (data) => {
    console.log(
      `[Event: document.deleted] Document purged: ${data.documentId} by owner ${data.ownerId}`
    );
  });
}
