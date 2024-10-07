@echo off

:: Clone the repository
git clone https://github.com/Sickman63/HawkMarket

:: Navigate to the project directory
cd HawkMarket

:: Install backend dependencies
cd backend
npm install

:: Navigate to the frontend directory and install dependencies
cd ..\frontend
npm install

:: Navigate back to the root directory
cd ..

echo Setup complete. Please configure your environment variables in the .env files for both backend and frontend.
pause