# 🎯 DraftKings Automation Project - Tasks Summary & Execution Guide

This repository contains files related to all 3 automation tasks:

---

## 📌 File Breakdown by Task:

| File Name                     | Task     | Description                                      |
|------------------------------|----------|------------------------------------------------|
| `Part 1 - Test Design.xlsx`   | Task 1   | Manual test cases design for Slot Game          |
| `Part 3 - Code Debugging.pdf` | Task 3   | Debugging + code review feedback for broken tests|
| *All remaining project files* | **Task 2** | Full automation suite for Slot Game API (Playwright) |

---

## 🛠️ Technologies Used

| Technology       | Purpose                                                           |
|------------------|-------------------------------------------------------------------|
| **Playwright**   | API test automation framework with test runner                    |
| **Allure**       | Reporting system to visualize test steps, logs, and results       |
| **Winston**      | Logging library used to track API requests/responses              |
| **dotenv**       | Loads environment variables from `.env`                           |
| **GitHub Actions** | Automates test execution on every push or PR to main             |

---

## 🤖 API Clients Rationale

All 4 main APIs were implemented as dedicated classes to allow **reusability**, **clean separation of logic**, and **easy test scalability**:

- `UserApi` – Balance retrieval and update  
- `GameApi` – Spins the slot machine  
- `PaymentApi` – Handles placing bets and payouts  
- `NotificationApi` – Sends game result notifications to the user  

Each API class uses `APIRequestContext` injected from Playwright for request management.

---

## 📂 .env Configuration

The `.env` file allows you to customize key parameters:

```env
BASE_URL=http://localhost:3000
USER_ID=123
BET_AMOUNT=10

---
# ⚠️ Assumptions

- The backend server is accessible locally on `http://localhost:3000` and supports all required endpoints.
- The user ID used for testing has a sufficient initial balance.
- Endpoints follow expected contract:
  - `/slot/spin` returns an outcome of either `"WIN"` or `"LOSE"`
  - `/payment/payout` is called only on win, and the `winAmount` matches the spin result
  - Notifications are always expected after every spin

---
# Running the Tests Locally

## Option 1: Windows Users - Using `run-tests.bat`

You can either double-click the `run-tests.bat` script, or run it directly from your terminal:

This will:

- Run all Playwright tests  
- Generate a fresh Allure report  
- Open the report automatically in your default browser  

If you’re on Linux and need a .bash script — let me know, I can create one.

---

Run the following commands manually in your terminal:

npx playwright test
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report


---

## GitHub CI/CD Integration

A full GitHub Actions workflow is included:

- Triggered on every push or pull request to the `main` branch  
- Installs dependencies and Playwright browsers  
- Executes the full test suite  
- Generates Allure report  
- Uploads Allure report as downloadable artifact  

You can view results in GitHub → Actions tab → latest run → download allure report

---

## Estimated Time Taken

| Task                                                                 | Time             |
|----------------------------------------------------------------------|------------------|
| Requirement analysis, high-level test plan, debugging & optimization | 1.5 hours        |
| Project design, infrastructure setup, debugging & optimization       | 2.5 - 3 hours    |
| Full solution implementation                                         | 40 minutes–1 hour|
| README & documentation                                               | 30 minutes       |
| **Total**                                                            |**~5.5- 6 hours** |
