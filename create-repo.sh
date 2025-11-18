#!/bin/bash

# Script to create GitHub repository
# Usage: GITHUB_TOKEN=your_token ./create-repo.sh

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ GITHUB_TOKEN not set"
    echo "Usage: GITHUB_TOKEN=your_token ./create-repo.sh"
    echo "Or add GITHUB_TOKEN to .env file"
    exit 1
fi

GITHUB_USER="lbazzani"
REPO_NAME="corso-ai-slides"

echo "🚀 Creating GitHub repository: $GITHUB_USER/$REPO_NAME"

# Create repository
response=$(curl -s -w "\n%{http_code}" -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"$REPO_NAME\",\"description\":\"AI Course - Generative, Agentic and Energy | Corso completo sull'AI Generativa e Agentica\",\"private\":false}")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" = "201" ]; then
    echo "✅ Repository created successfully!"
    echo ""
    echo "📦 Pushing to GitHub..."
    git push -u origin main
    echo ""
    echo "🎉 Done! Repository available at: https://github.com/$GITHUB_USER/$REPO_NAME"
elif [ "$http_code" = "422" ]; then
    echo "ℹ️  Repository already exists"
    echo "📦 Pushing to GitHub..."
    git push -u origin main
    echo ""
    echo "🎉 Done! Repository available at: https://github.com/$GITHUB_USER/$REPO_NAME"
else
    echo "❌ Error creating repository (HTTP $http_code)"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
    exit 1
fi
