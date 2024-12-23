#!/bin/sh

# Clean up any existing stop file
rm -f /tmp/stop_tunnel

# Handle Ctrl+C by creating stop file and killing processes
trap 'touch /tmp/stop_tunnel; kill $(jobs -p) 2>/dev/null; exit' INT TERM

# Ensure SSH key has correct permissions
chmod 600 comfy.pem

# Start autossh to maintain SSH tunnel in background
autossh -M 20000 -o StrictHostKeyChecking=no -i ./comfy.pem -p ${SSH_PORT} -L ${COMFY_PORT}:localhost:${COMFY_PORT} ${SSH_USER}@${SSH_SERVER} -N &

# Start the Node.js server
exec node server/index.mjs
