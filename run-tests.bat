@echo off
echo Running Playwright tests...
npx playwright test

if %errorlevel% neq 0 (
    echo ❌ Playwright tests failed. Exiting...
    exit /b %errorlevel%
)

echo.
echo Generating Allure report...
npx allure generate allure-results --clean -o allure-report

if %errorlevel% neq 0 (
    echo ❌ Failed to generate Allure report. Exiting...
    exit /b %errorlevel%
)

echo.
echo Opening Allure report in browser...
npx allure open allure-report