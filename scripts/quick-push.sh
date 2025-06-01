#!/bin/bash

# Quick Push Script - Generates the exact commands you need to copy/paste

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Quick Push Commands for Duration Project${NC}"
echo "========================================"
echo ""

# Get current branch
BRANCH=$(git branch --show-current)

# Check for unpushed commits
UNPUSHED=$(git log origin/$BRANCH..$BRANCH --oneline 2>/dev/null | wc -l)

if [ $UNPUSHED -eq 0 ]; then
    echo -e "${GREEN}✓ No commits to push${NC}"
    exit 0
fi

echo -e "${YELLOW}You have $UNPUSHED commit(s) to push on branch '$BRANCH'${NC}"
echo ""

# Show the commits
echo "Commits to push:"
git log origin/$BRANCH..$BRANCH --oneline
echo ""

echo -e "${GREEN}Copy and run ONE of these commands in your local terminal:${NC}"
echo ""

echo "# Option 1: If you have Git credentials saved"
echo -e "${BLUE}git push origin $BRANCH${NC}"
echo ""

echo "# Option 2: Using a Personal Access Token"
echo -e "${BLUE}git push https://drigobl:YOUR_PERSONAL_ACCESS_TOKEN@github.com/drigobl/Duration-Give.git $BRANCH${NC}"
echo ""

echo "# Option 3: If using SSH"
echo -e "${BLUE}git remote set-url origin git@github.com:drigobl/Duration-Give.git${NC}"
echo -e "${BLUE}git push origin $BRANCH${NC}"
echo ""

echo -e "${YELLOW}Need a Personal Access Token?${NC}"
echo "1. Go to: https://github.com/settings/tokens/new"
echo "2. Name it: 'Duration Push'"
echo "3. Give it 'repo' scope"
echo "4. Generate and copy the token"
echo "5. Replace YOUR_PERSONAL_ACCESS_TOKEN in Option 2 above"