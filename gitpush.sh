#!/bin/bash


# Ask for commit message
echo "Enter commit message:"
read message

#Add all changes
git add .

#commit 
git commit -m "$message"


#branch=$(git branch --show-current)

#Ask for branch
echo "Which branch are you commit to:"
read branch
git push origin $branch


echo "✅ Changes pushed to branch '$branch'."