echo Running application for Frontend...
cd frontend

REM Install dependencies if needed
if not exist node_modules (
    echo Installing backend dependencies...
    npm install
)

REM Run application
call npm start