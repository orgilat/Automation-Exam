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

## Running the Tests Locally

### Option 1: Windows Users - Using `run-tests.bat`

You can either double-click the `run-tests.bat` script, or run it directly from your terminal:

This will:

- Run all Playwright tests  
- Generate a fresh Allure report  
- Open the report automatically in your default browser  

If you’re on Linux and need a `.sh` script — let me know, I can create one.

---

### Option 2: Manual Run (Cross-platform)

Run the following commands manually in your terminal:

npx playwright test
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report

yaml
Copy
Edit

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
## 📂 `.env` Configuration

A `.env` file is included to allow flexible environment setup:

```env
BASE_URL=http://localhost:3000
USER_ID=123
BET_AMOUNT=10
## Estimated Time Taken
---

| Task                                                                 | Time             |
|----------------------------------------------------------------------|------------------|
| Requirement analysis, high-level test plan, debugging & optimization | 1.5 hours        |
| Project design, infrastructure setup, debugging & optimization       | 2.5 - 3 hours    |
| Full solution implementation                                         | 40 minutes–1 hour|
| README & documentation                                               | 30 minutes       |
| **Total**                                                            | **~5.5 - 6 hours** |
