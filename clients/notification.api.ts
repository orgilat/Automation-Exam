import { APIRequestContext } from '@playwright/test';

export class NotificationApi {
  private api: APIRequestContext;

  constructor(api: APIRequestContext) {
    this.api = api;
  }

  // Sends a notification to the user with details about the game outcome
  async notify(userId: number, transactionId: string, message: string) {
    const response = await this.api.post('/notify', {
      data: { userId, transactionId, message },
    });
    const body = await response.json();
    return { response, body };
  }
}
