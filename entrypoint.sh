#!/bin/sh

# Clean up any existing stop file
rm -f /tmp/stop_tunnel

# Handle Ctrl+C by creating stop file and killing processes
trap 'touch /tmp/stop_tunnel; kill $(jobs -p) 2>/dev/null; exit' INT TERM

# Ensure SSH key has correct permissions
chmod 600 comfy.pem

maintain_tunnel() {
    while [ ! -f /tmp/stop_tunnel ]; do
        ssh -o StrictHostKeyChecking=no -i ./comfy.pem -p ${SSH_PORT} -L ${COMFY_PORT}:localhost:${COMFY_PORT} ${SSH_USER}@${SSH_SERVER} -N
        if [ -f /tmp/stop_tunnel ]; then
            break
        fi
        echo "SSH tunnel disconnected. Reconnecting in 5 seconds..."
        sleep 5
    done
}

# Start SSH tunnel monitor in background
maintain_tunnel &

# Start the Node.js server
exec node server/index.mjs