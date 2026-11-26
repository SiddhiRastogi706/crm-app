import { Response } from 'express';
import { logger } from '../config/logger';

interface SSEClient {
  id: string;
  userId?: string;
  res: Response;
}

class SSEManager {
  private clients: SSEClient[] = [];

  addClient(id: string, res: Response, userId?: string) {
    this.clients.push({ id, res, userId });
    logger.debug({ clientId: id, userId }, 'SSE client connected');

    // Send initial keep-alive comment
    res.write(': connected\n\n');
  }

  removeClient(id: string) {
    this.clients = this.clients.filter((c) => c.id !== id);
    logger.debug({ clientId: id }, 'SSE client disconnected');
  }

  broadcast(event: string, data: any) {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    this.clients.forEach((client) => {
      try {
        client.res.write(payload);
      } catch (err) {
        logger.error({ clientId: client.id, err }, 'Failed to write SSE event');
      }
    });
  }

  sendToUser(userId: string, event: string, data: any) {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    this.clients
      .filter((client) => client.userId === userId)
      .forEach((client) => {
        try {
          client.res.write(payload);
        } catch (err) {
          logger.error({ clientId: client.id, userId, err }, 'Failed to send SSE to user');
        }
      });
  }
}

export const sseManager = new SSEManager();
