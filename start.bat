@echo off
echo 🚀 Starting Lost & Found Portal...
echo.

echo 📦 Installing dependencies...
call npm run install-all

echo.
echo 🔧 Setting up environment...
call node setup.js

echo.
echo 🗄️ Starting MongoDB (make sure MongoDB is installed and running)...
echo    If MongoDB is not running, please start it manually.

echo.
echo 🌐 Starting the application...
echo    Frontend: http://localhost:5173
echo    Backend: http://localhost:5000
echo.

call npm run dev

pause








