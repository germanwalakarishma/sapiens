@echo off
echo Start Backend by running run-backend.bat file

echo ----------------------------------------

echo Running Integration tests...
cd e2e

REM Run integration tests
call npx playwright test

echo ----------------------------------------
echo All tests executed.
