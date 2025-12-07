#!/bin/bash

# Start script for production deployment

echo "🚀 Starting Blur Hour..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    echo "Please copy .env.production.example to .env and configure it"
    exit 1
fi

# Start with Docker Compose SSL
echo "🔒 Starting with SSL (Caddy)..."
docker-compose -f docker-compose.ssl.yml up -d

echo "✅ Blur Hour is running!"
echo "📊 Check logs: docker-compose -f docker-compose.ssl.yml logs -f"
echo "🛑 Stop: docker-compose -f docker-compose.ssl.yml down"
