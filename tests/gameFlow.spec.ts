import { test, expect, APIRequestContext, request } from '@playwright/test';
// Import custom API clients (wrapper classes for HTTP endpoints)
import { UserApi } from '../clients/user.api';
import { PaymentApi } from '../clients/payment.api';
import { GameApi } from '../clients/game.api';
import { NotificationApi } from '../clients/notification.api';
import logger from '../utils/logger';
import { allure } from 'allure-playwright';

// Load environment variables with fallback defaults
const BASE_URL = process.env.BASE_URL!; 
const USER_ID = Number(process.env.USER_ID ?? '123'); // Test user ID
const BET_AMOUNT = Number(process.env.BET_AMOUNT ?? '10'); // Amount to bet each round

test.describe('Slot Machine Full Game Flow E2E', () => {
  // Shared API context for making HTTP requests
  let apiContext: APIRequestContext;
  // Declare API client instances
  let userApi: UserApi;
  let paymentApi: PaymentApi;
  let gameApi: GameApi;
  let notificationApi: NotificationApi;

  // Initialize the API clients before running any tests
  test.beforeAll(async () => {
    apiContext = await request.newContext({ baseURL: BASE_URL }); // Create new request context
    userApi = new UserApi(apiContext);          // Initialize user API client
    paymentApi = new PaymentApi(apiContext);    // Initialize payment API client
    gameApi = new GameApi(apiContext);          // Initialize game/spin API client
    notificationApi = new NotificationApi(apiContext); // Initialize notification client
  });
  test('Full game flow: balance -> bet -> spin -> payout (if win) -> notify', async () => {
    // Add Allure metadata for report generation
    allure.owner('Or Gilat'); 
    allure.description('End-to-end test for full slot game flow');
    allure.severity('critical');
    allure.tag('e2e', 'slot', 'api');
    logger.info('Test started');

    // Local state variables
    let balanceBefore = 0;          // Initial balance
    let transactionId = '';         // Transaction ID from bet step
    let winAmount = 0;              // Win amount returned by spin
    let message = '';               // Message to be sent to notification
    let balanceAfterSpin = 0;       // Final balance after spin/payout

    await allure.step('Get user balance', async () => {
      const { response, body } = await userApi.getBalance(USER_ID);
      expect(response.status()).toBe(200);                 // Validate HTTP status
      expect(body).toHaveProperty('balance');              // Balance must exist
      expect(body).toHaveProperty('userId', USER_ID);      // Correct user ID
      expect(typeof body.balance).toBe('number');          // Ensure balance is a number
      expect(body.currency).toBe('USD');                   // Currency should be USD

      balanceBefore = body.balance;                        // Store initial balance
      logger.info(`Initial balance: ${balanceBefore}`);
    });
    await allure.step('Place bet', async () => {
      const { response, body } = await paymentApi.placeBet(USER_ID, BET_AMOUNT);
      expect([200, 201]).toContain(response.status());     // Accept 200 or 201
      expect(body.status).toBe('SUCCESS');                 // Ensure bet was successful
      expect(typeof body.transactionId).toBe('string');    // Must return a transaction ID
      expect(typeof body.newBalance).toBe('number');       // New balance must be a number
      expect(body.userId).toBe(USER_ID);
      expect(body.newBalance).toBeCloseTo(balanceBefore - BET_AMOUNT, 2); // Balance should decrease by bet amount

      transactionId = body.transactionId;                  // Store transaction ID for spin
      logger.info(`Bet placed. Transaction ID: ${transactionId}`);
    });
    await allure.step('Spin slot machine', async () => {
      const { response, body } = await gameApi.spin(USER_ID, BET_AMOUNT, transactionId);
      expect([200, 201]).toContain(response.status());     // Validate status code

      // Ensure that response contains either Win or Lose
      expect('Win' in body || 'Lose' in body).toBe(true);

      // If user won the spin
      if ('Win' in body) {
        const win = body.Win;
        expect(win.userId).toBe(USER_ID);
        expect(typeof win.winAmount).toBe('number');       // Must return numeric win amount
        expect(Array.isArray(win.reels)).toBe(true);       // Reels must be an array
        expect(typeof win.message).toBe('string');         // Must include a message

        winAmount = win.winAmount;                         // Store win amount
        message = win.message;                             // Store message for notification
        logger.info(`Spin result: WIN with ${winAmount}`);

        await allure.step('Process payout', async () => {
          const { response, body } = await paymentApi.payout(USER_ID, transactionId, winAmount);
          expect([200, 201]).toContain(response.status());
          expect(body.status).toBe('SUCCESS');
          expect(body.transactionId).toBe(transactionId);   // Ensure correct transaction
          expect(body.userId).toBe(USER_ID);
          expect(typeof body.newBalance).toBe('number');
          expect(body.newBalance).toBeCloseTo(balanceBefore - BET_AMOUNT + winAmount, 2);

          logger.info(`Payout successful. New balance: ${body.newBalance}`);
        });

      } else {
        // If user lost the spin
        const lose = body.Lose;
        expect(lose.userId).toBe(USER_ID);
        expect(lose.winAmount).toBe(0);                    // Win amount must be zero
        expect(Array.isArray(lose.reels)).toBe(true);
        expect(typeof lose.message).toBe('string');

        winAmount = 0;                                     // No win amount
        message = lose.message;                            // Use lose message
        logger.info('Spin result: LOSE');
      }
    });
    await allure.step('Validate balance after spin', async () => {
      const { response, body } = await userApi.getBalance(USER_ID);
      expect(response.status()).toBe(200);
      expect(typeof body.balance).toBe('number');

      balanceAfterSpin = body.balance;
      const expectedBalance = balanceBefore - BET_AMOUNT + winAmount; // Calculate expected balance
      expect(balanceAfterSpin).toBeCloseTo(expectedBalance, 2);       // Compare with expected

      logger.info(`Balance after spin: ${balanceAfterSpin}`);
    });

    await allure.step('Send notification', async () => {
      const { response, body } = await notificationApi.notify(USER_ID, transactionId, message);
      expect([200, 201]).toContain(response.status());
      expect(body.status).toBe('SENT');                  // Ensure notification sent successfully
      expect(body.notificationId).toBeDefined();         // ID should be returned

      logger.info(`Notification sent. ID: ${body.notificationId}`);
    });

    logger.info('Test completed successfully');
  });
});
