#!/bin/bash

echo "🚀 Starting deployment process..."

# 1. Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# 2. Push database schema (if needed)
echo "🗄️  Pushing database schema..."
npx prisma db push

# 3. Seed database with initial data
echo "🌱 Seeding database..."
npm run prisma:seed

# 4. Build the application
echo "🔨 Building application..."
npm run build

echo "✅ Build completed successfully!"
echo "🎉 Ready for deployment to Vercel!"
echo ""
echo "Next steps:"
echo "1. Commit your changes: git add . && git commit -m 'Fix academy page 500 error'"
echo "2. Push to your repository: git push"
echo "3. Vercel will automatically deploy your changes"
