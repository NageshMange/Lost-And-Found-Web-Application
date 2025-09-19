#!/bin/bash

echo "🚀 Starting Lost & Found Portal..."
echo

echo "📦 Installing dependencies..."
npm run install-all

echo
echo "🔧 Setting up environment..."
node setup.js

echo
echo "🗄️ Starting MongoDB (make sure MongoDB is installed and running)..."
echo "   If MongoDB is not running, please start it manually."

echo
echo "🌐 Starting the application..."
echo "   Frontend: http://localhost:5173"
echo "   Backend: http://localhost:5000"
echo

npm run dev








