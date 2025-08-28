#!/bin/bash
echo "🚀 Starting production/staging environment..."
docker-compose -f docker-compose.yml up --build