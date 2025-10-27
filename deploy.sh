#!/bin/bash

# GitHub Pages deployment script
# This script builds the project and deploys it to the gh-pages branch

set -e

echo "🚀 Starting GitHub Pages deployment..."

# Build the project
echo "📦 Building project..."
npm run build

# Check if gh-pages branch exists
if git show-ref --verify --quiet refs/heads/gh-pages; then
    echo "📋 gh-pages branch exists, switching to it..."
    git checkout gh-pages
    git pull origin gh-pages
else
    echo "📋 Creating gh-pages branch..."
    git checkout --orphan gh-pages
    git rm -rf .
fi

# Copy dist contents to root
echo "📁 Copying build files..."
cp -r dist/* .

# Add all files
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy to GitHub Pages - $(date)"

# Push to gh-pages branch
echo "🚀 Pushing to GitHub Pages..."
git push origin gh-pages

# Switch back to main branch
git checkout main

echo "✅ Deployment complete! Your site should be available at:"
echo "https://ashrafrezk.github.io/Cloudastick2025website/"
