@echo off
echo Starting MongoDB...
start "MongoDB" "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath C:\data\db

echo Waiting for MongoDB to start...
timeout /t 5 >nul

echo Starting Node.js server with nodemon...
cd server
npm run dev
