#!/bin/bash

# Check for Node.js and npm
if ! [ -x "$(command -v node)" ]; then
  echo 'Error: Node.js is not installed.' >&2
  echo 'Installing Node.js...'
  curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
  sudo apt-get install -y nodejs
else
  echo 'Node.js is already installed.'
fi

if ! [ -x "$(command -v npm)" ]; then
  echo 'Error: npm is not installed.' >&2
  echo 'Installing npm...'
  sudo apt-get install -y npm
else
  echo 'npm is already installed.'
fi

# Navigate to your Node.js app directory (modify this path as needed)
cd /path/to/your/nodejs/app

# Install the necessary npm packages
npm install

echo 'All dependencies are installed or up-to-date.'

#Make it executable: chmod +x setup.sh.
#Run the script: ./setup.sh.