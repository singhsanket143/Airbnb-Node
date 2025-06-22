#!/bin/bash

# Start MySQL
brew services start mysql || { echo "Failed to start MySQL"; exit 1; }

# Start nodemon which runs in foreground
nodemon src/server.ts

# Stop MySQL when the script ends
brew services stop mysql || { echo "Failed to stop  MySQL"; exit 1; }