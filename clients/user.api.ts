import { APIRequestContext } from '@playwright/test';

export class UserApi {
  private api: APIRequestContext;

  constructor(api: APIRequestContext) {
    this.api = api;
  }

  // Retrieves the current balance of a user by userId
  async getBalance(userId: number) {
    const response = await this.api.get(`/user/balance?userId=${userId}`);
    const body = await response.json();
    return { response, body };
  }

  // Sends a request to update the user's balance to a new amount
  async updateBalance(userId: number, newBalance: number) {
    const response = await this.api.post('/user/update-balance', {
      data: { userId, newBalance },
    });
    const body = await response.json();
    return { response, body };
  }
}
