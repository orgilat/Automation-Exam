import { APIRequestContext } from '@playwright/test';

export class PaymentApi {
  private api: APIRequestContext;

  constructor(api: APIRequestContext) {
    this.api = api;
  }

  // Sends a request to place a bet for the user with the specified amount
  async placeBet(userId: number, betAmount: number) {
    const response = await this.api.post('/payment/placeBet', {
      data: { userId, betAmount },
    });
    const body = await response.json();
    return { response, body };
  }

  // Sends a request to payout winnings to the user for a specific transaction
  async payout(userId: number, transactionId: string, winAmount: number) {
    const response = await this.api.post('/payment/payout', {
      data: { userId, transactionId, winAmount },
    });
    const body = await response.json();
    return { response, body };
  }
}
