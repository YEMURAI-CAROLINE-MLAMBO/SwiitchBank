#!/bin/bash

# Initialize environment
cp .env.example .env
docker-compose pull

# Build and start containers
docker-compose up --build -d

# Wait for services to initialize
echo "Waiting for services to start..."
sleep 15

# Run database migrations
docker-compose exec backend npm run migrate

# Seed initial data
docker-compose exec backend npm run seed

# Create admin user
docker-compose exec backend node scripts/create-admin.js

echo ""
echo "======= SWIITCHBANK STARTED ======="
echo "Frontend:     http://localhost:3000"
echo "Backend API:  http://localhost:5000"
echo "Adminer:      http://localhost:8080?pgsql=db&username=${DB_USER}&db=${DB_NAME}"
echo "Prometheus:   http://localhost:9090"
echo "Grafana:      http://localhost:3001 (admin:${GRAFANA_ADMIN_PASSWORD})"
echo "MailHog:      http://localhost:8025"
echo "Traefik:      http://localhost:8081"
