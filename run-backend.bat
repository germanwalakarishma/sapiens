echo Running application for Backend...
cd backend

REM Install dependencies if needed
if not exist node_modules (
    echo Installing backend dependencies...
    npm install
)

REM Run application
call npm start