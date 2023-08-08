#!/bin/bash

# Check if Node.js and npm are installed
if ! [ -x "$(command -v node)" ]; then
  echo "Node.js is not installed. Installing now..."
  curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
  sudo apt-get install -y nodejs
else
  echo "Node.js is already installed."
fi

if ! [ -x "$(command -v npm)" ]; then
  echo "npm is not installed. Installing now..."
  sudo apt-get install -y npm
else
  echo "npm is already installed."
fi

# Ensure required npm packages are installed
npm_packages=("cors" "axios" "express")

for pkg in "${npm_packages[@]}"; do
    if ! npm list --depth 1 --global $pkg > /dev/null 2>&1; then
        echo "Installing $pkg..."
        npm install $pkg
    else
        echo "$pkg is already installed."
    fi
done

echo "All dependencies are installed or up-to-date."
