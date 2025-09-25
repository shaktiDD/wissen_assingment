@echo off
echo 🚀 Starting Vacation Calendar Application...
echo.

echo 📁 Starting Backend Server...
cd backend
start "Backend Server" cmd /c "node server.js"
cd ..

echo 📁 Starting Frontend Application...
cd frontend  
start "Frontend App" cmd /c "npm start"
cd ..

echo.
echo ✅ Both servers are starting!
echo 🌐 Backend: http://localhost:5000
echo 🎨 Frontend: http://localhost:3000
echo.
echo 🇮🇳 India holidays are fully supported!
echo 🎉 Enjoy your vacation calendar!

pause