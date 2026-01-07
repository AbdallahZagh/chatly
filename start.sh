#!/bin/bash

# Exit on error
set -e

# Run optimizations
echo "Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Generate Swagger Documentation (at runtime, picking up the correct APP_URL/L5_SWAGGER_CONST_HOST)
echo "Generating Swagger Docs..."
php artisan l5-swagger:generate

# Run Migrations (Force is needed for production)
echo "Running Migrations..."
php artisan migrate --force

# Start Supervisor (which starts Apache & Reverb)
echo "Starting Supervisor..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
