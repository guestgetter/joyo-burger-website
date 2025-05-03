#!/bin/bash

# Define the preferred ports in order
PORTS=(8000 8080 8888 3000 5000)

# Function to check if a port is available
is_port_available() {
    # Try to bind to the port; if it succeeds, port is available
    (echo > /dev/tcp/127.0.0.1/$1) > /dev/null 2>&1
    # Return the opposite of the last command's exit status (0 if port is available)
    return $?
}

# Loop through preferred ports
for PORT in "${PORTS[@]}"; do
    echo "Checking if port $PORT is available..."
    if is_port_available $PORT; then
        echo "Port $PORT is already in use, trying next port..."
    else
        echo "Starting server on port $PORT..."
        python3 -m http.server $PORT
        exit 0
    fi
done

echo "All preferred ports are in use. Please free up one of these ports and try again."
exit 1 