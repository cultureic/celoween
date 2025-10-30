#!/bin/bash

# Celoween Database Setup Script
# This script helps you set up the Supabase database connection securely

echo "🎃 Celoween Database Setup"
echo "=========================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found!"
    exit 1
fi

# Prompt for Supabase password
echo "Please enter your Supabase database password:"
echo "(The password from your Supabase project settings)"
read -s SUPABASE_PASSWORD

if [ -z "$SUPABASE_PASSWORD" ]; then
    echo "❌ Error: Password cannot be empty!"
    exit 1
fi

# Replace [YOUR-PASSWORD] in .env.local
echo ""
echo "🔄 Updating database URLs in .env.local..."

# Use different sed syntax for macOS vs Linux
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/\[YOUR-PASSWORD\]/$SUPABASE_PASSWORD/g" .env.local
else
    # Linux
    sed -i "s/\[YOUR-PASSWORD\]/$SUPABASE_PASSWORD/g" .env.local
fi

echo "✅ Database URLs updated!"
echo ""

# Run Prisma migrations
echo "🔄 Generating Prisma Client..."
npx prisma generate

echo ""
echo "🔄 Running database migrations..."
npx prisma migrate deploy

echo ""
echo "✅ Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Verify connection: npx prisma db pull"
echo "2. Open Prisma Studio: npx prisma studio"
echo ""
