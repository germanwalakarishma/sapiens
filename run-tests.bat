@echo off
echo Running tests for Backend...
cd backend

REM Install dependencies if needed
if not exist node_modules (
    echo Installing backend dependencies...
    npm install
)

REM Run backend tests
call npm test

echo ----------------------------------------

echo Running tests for Frontend...
cd ../frontend

REM Install dependencies if needed
if not exist node_modules (
    echo Installing frontend dependencies...
    npm install
)

REM Run frontend tests
call npm test

echo ----------------------------------------
echo All tests executed.
