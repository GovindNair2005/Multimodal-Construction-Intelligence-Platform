#!/bin/bash
# Multimodal Construction Intelligence Platform - Launch Script

set -e

echo "🏗️ Starting Multimodal Construction Intelligence Platform..."

# 1. Activate backend environment and launch FastAPI
echo "▶️ Launching FastAPI Backend on http://localhost:8000..."
cd backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
cd ..

# 2. Launch Vite React Frontend
echo "▶️ Launching React Vite Frontend on http://localhost:5173..."
cd frontend
npm run dev -- --host 0.0.0.0 &
FRONTEND_PID=$!
cd ..

echo "✅ All services started successfully!"
echo "📍 Frontend Dashboard: http://localhost:5173/"
echo "📍 API Swagger Docs:   http://localhost:8000/docs"
echo "Press Ctrl+C to terminate both servers."

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
