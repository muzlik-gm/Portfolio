#!/bin/bash

# Quick Push to GitHub Script (Bash)

echo "🚀 Pushing to GitHub..."
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "Initializing Git repository..."
    git init
fi

# Check if remote exists
if ! git remote | grep -q "origin"; then
    echo "Adding GitHub remote..."
    git remote add origin https://github.com/muzlik-gm/Portfolio.git
fi

# Check current branch
current_branch=$(git branch --show-current)

if [ "$current_branch" != "main" ]; then
    echo "Switching to main branch..."
    git checkout -b main 2>/dev/null || git checkout main
fi

# Stage all files
echo "Staging files..."
git add .

# Check if there are changes to commit
if [ -n "$(git status --porcelain)" ]; then
    # Commit
    echo "Committing changes..."
    read -p "Enter commit message (or press Enter for default): " commit_message
    
    if [ -z "$commit_message" ]; then
        commit_message="Update: Portfolio improvements and fixes"
    fi
    
    git commit -m "$commit_message"
    
    # Push
    echo "Pushing to GitHub..."
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Successfully pushed to GitHub!"
        echo "🌐 View at: https://github.com/muzlik-gm/Portfolio"
        echo ""
        echo "Next steps:"
        echo "1. Go to https://vercel.com/new"
        echo "2. Import your GitHub repository"
        echo "3. Add environment variables"
        echo "4. Deploy!"
    else
        echo ""
        echo "❌ Push failed. Check the error above."
        echo ""
        echo "Common fixes:"
        echo "1. Make sure you're logged into GitHub"
        echo "2. Try: git pull origin main --rebase"
        echo "3. Then run this script again"
    fi
else
    echo "No changes to commit."
fi

echo ""
read -p "Press Enter to exit"
