# 🎯 DraftKings Automation Project - Tasks Summary & Execution Guide

This repository contains files related to all 3 automation tasks:

---

## 📌 File Breakdown by Task:

| File Name                      | Task     | Description                                           |
|-------------------------------|----------|-------------------------------------------------------|
| `Part 1 - Test Design.xlsx`   | Task 1   | Manual test cases design for the Slot Game           |
| `Part 3 - Code Debugging.pdf` | Task 3   | Debugging + code review feedback for broken tests     |
| *All remaining project files* | **Task 2** | Full automation suite for Slot Game API (Playwright) |

---

## 🛠️ Technologies Used

| Technology        | Purpose                                                             |
|-------------------|---------------------------------------------------------------------|
| **Playwright**     | API test automation framework with integrated test runner           |
| **Allure**         | Generates interactive HTML reports for test execution              |
| **Winston**        | Logging library used for structured API request/response logs      |
| **dotenv**         | Loads environment variables from a `.env` file                     |
| **GitHub Actions** | Automates test execution on every push/PR to the `main` branch     |

---

## 🤖 API Clients Rationale

All 4 core APIs were implemented as modular classes to ensure:
- 🔁 Reusability
- 🧹 Separation of concerns
- ⚙️ Scalable and maintainable test structure

| API Class          | Responsibility                                      |
|--------------------|-----------------------------------------------------|
| `UserApi`          | Retrieve and update user balance                    |
| `GameApi`          | Perform game spins                                  |
| `PaymentApi`       | Handle bet placement and payout logic               |
| `NotificationApi`  | Send user notifications after each spin             |

All classes utilize Playwright's `APIRequestContext` for HTTP interactions.

---


## Assumptions

- The backend server is accessible locally on `http://localhost:3000` and supports all required endpoints.
- The user ID used for testing has a sufficient initial balance.
- Endpoints follow expected contract:
  - `/slot/spin` returns an outcome of either `"WIN"` or `"LOSE"`
  - `/payment/payout` is called only on win, and the `winAmount` matches the spin result
  - Notifications are always expected after every spin

---

## 4. Local Execution

```bash
# Run API & UI tests\ npx playwright test

# Generate Allure report\ npx allure generate allure-results --clean -o allure-report

# Open the report\ npx allure open allure-report
```

> **Windows users:** I’ve provided a quick-run batch file so you can generate and view the report with a double-click.

---

## CI Pipeline Behavior

On every push or PR to `main`, GitHub Actions will:

1. Checkout code & install dependencies (`npm ci`).
2. Install Playwright browsers (`npx playwright install --with-deps`).
3. Run all tests (`npx playwright test`).
4. Generate Allure report (`npx allure generate allure-results --clean -o allure-report`).
5. Upload `allure-report/` as an artifact.

---


## Estimated Time Taken

| Task                                                                 | Time             |
|----------------------------------------------------------------------|------------------|
| Requirement analysis, high-level test plan, debugging & optimization | 1.5 hours        |
| Project design, infrastructure setup, debugging & optimization       | 2.5 - 3 hours    |
| Full solution implementation                                         | 40 minutes–1 hour|
| README & documentation                                               | 30 minutes       |
| **Total**                                                            | **~5.5 - 6 hours** |
