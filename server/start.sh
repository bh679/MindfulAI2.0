#!/bin/bash

# Check if PM2 is installed
if ! [ -x "$(command -v pm2)" ]; then
  echo "PM2 is not installed. Installing now..."
  npm install -g pm2
else
  echo "PM2 is already installed."
fi

# Start the server using PM2 and the ecosystem.config.js configuration
pm2 start ecosystem.config.js

echo "Server started with PM2 using ecosystem.config.js configuration."

#Displays log
pm2 log
