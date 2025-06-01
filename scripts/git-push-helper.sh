#!/bin/bash

# Git Push Helper Script for Duration Project
# This script helps with pushing changes to GitHub when credentials aren't configured

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Git Push Helper for Duration Project${NC}"
echo "====================================="

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}Error: Not in a git repository${NC}"
    exit 1
fi

# Show current branch and status
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${GREEN}Current branch:${NC} $CURRENT_BRANCH"
echo ""

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}Warning: You have uncommitted changes${NC}"
    git status --short
    echo ""
    read -p "Do you want to commit these changes first? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter commit message: " commit_msg
        git add -A
        git commit -m "$commit_msg"
    fi
fi

# Show commits to be pushed
echo -e "${GREEN}Commits to be pushed:${NC}"
git log origin/$CURRENT_BRANCH..$CURRENT_BRANCH --oneline
echo ""

# Check remote URL
REMOTE_URL=$(git remote get-url origin)
echo -e "${GREEN}Remote URL:${NC} $REMOTE_URL"
echo ""

# Determine authentication method
if [[ $REMOTE_URL == git@github.com:* ]]; then
    echo -e "${GREEN}Using SSH authentication${NC}"
    echo "Pushing to origin/$CURRENT_BRANCH..."
    git push origin $CURRENT_BRANCH
elif [[ $REMOTE_URL == https://github.com/* ]]; then
    echo -e "${YELLOW}Using HTTPS authentication${NC}"
    echo ""
    echo "You'll need to authenticate. Choose an option:"
    echo "1) Use Personal Access Token (recommended)"
    echo "2) Try with stored credentials"
    echo "3) Switch to SSH (requires SSH key setup)"
    echo "4) Generate push command for manual execution"
    echo ""
    read -p "Select option (1-4): " option

    case $option in
        1)
            echo ""
            echo -e "${BLUE}To create a Personal Access Token:${NC}"
            echo "1. Go to: https://github.com/settings/tokens/new"
            echo "2. Name: 'Duration Push Token'"
            echo "3. Expiration: Choose your preference"
            echo "4. Scopes: Select 'repo' (Full control of private repositories)"
            echo "5. Click 'Generate token' and copy it"
            echo ""
            read -p "Enter your GitHub username: " username
            read -s -p "Enter your Personal Access Token: " token
            echo ""
            
            # Extract repo path from URL
            REPO_PATH=$(echo $REMOTE_URL | sed 's|https://github.com/||' | sed 's|.git$||')
            
            # Push using token
            git push https://${username}:${token}@github.com/${REPO_PATH}.git $CURRENT_BRANCH
            
            echo ""
            echo -e "${GREEN}Push successful!${NC}"
            echo -e "${YELLOW}Note: The token was not saved. For future pushes, you can:${NC}"
            echo "- Run 'git config --global credential.helper cache' to cache credentials temporarily"
            echo "- Or set up SSH keys for permanent authentication"
            ;;
        2)
            echo "Attempting push with stored credentials..."
            git push origin $CURRENT_BRANCH
            ;;
        3)
            echo ""
            echo -e "${BLUE}To switch to SSH:${NC}"
            echo "1. First, set up an SSH key if you haven't:"
            echo "   ssh-keygen -t ed25519 -C \"your_email@example.com\""
            echo "2. Add the key to GitHub:"
            echo "   cat ~/.ssh/id_ed25519.pub"
            echo "   Copy and add at: https://github.com/settings/keys"
            echo "3. Then run:"
            echo "   git remote set-url origin git@github.com:drigobl/Duration-Give.git"
            echo ""
            read -p "Have you set up SSH keys? (y/n) " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                git remote set-url origin git@github.com:drigobl/Duration-Give.git
                echo "Remote URL updated to SSH. Attempting push..."
                git push origin $CURRENT_BRANCH
            else
                echo "Please set up SSH keys first, then run this script again."
            fi
            ;;
        4)
            echo ""
            echo -e "${BLUE}Manual push commands:${NC}"
            echo ""
            echo "# Option 1: With Personal Access Token"
            echo "git push https://YOUR_USERNAME:YOUR_TOKEN@github.com/drigobl/Duration-Give.git $CURRENT_BRANCH"
            echo ""
            echo "# Option 2: Regular HTTPS (will prompt for credentials)"
            echo "git push origin $CURRENT_BRANCH"
            echo ""
            echo "# Option 3: After setting up SSH"
            echo "git remote set-url origin git@github.com:drigobl/Duration-Give.git"
            echo "git push origin $CURRENT_BRANCH"
            ;;
        *)
            echo -e "${RED}Invalid option${NC}"
            exit 1
            ;;
    esac
else
    echo -e "${RED}Unknown remote URL format${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}Done!${NC}"