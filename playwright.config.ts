import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,  // 60 seconds timeout per test
  expect: {
    timeout: 5000,
  },
  reporter: [
    ['list'],
    ['allure-playwright'],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'API Tests',
      use: {},
    },
  ],
});
