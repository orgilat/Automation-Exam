import { APIRequestContext } from '@playwright/test';

export class GameApi {
  private api: APIRequestContext;

  constructor(api: APIRequestContext) {
    this.api = api;
  }

  // Sends a request to spin the slot machine for a given user, bet amount, and transaction ID
  async spin(userId: number, betAmount: number, transactionId: string) {
    const response = await this.api.post('/slot/spin', {
      data: { userId, betAmount, transactionId },
    });
    const body = await response.json();
    return { response, body };
  }
}
