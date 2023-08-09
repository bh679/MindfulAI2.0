#!/bin/bash
#ChatGPT thread to make this
#https://chat.openai.com/share/c99155e9-2367-4d36-ae33-404d32957b87

echo "Shutting down existing instances"
pm2 kill

# Start the server using PM2 and the ecosystem.config.js configuration
pm2 start ecosystem.config.cjs

echo "Server started with PM2 using ecosystem.config.cjs configuration."

#Displays log
pm2 log
