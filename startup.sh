#!/bin/bash

# Start MongoDB
mongod --config /app/mongod.conf --fork --logpath /var/log/mongodb/mongod.log

# Wait for MongoDB to start
sleep 5

# Start services
cd /app/posts-service && npm start &
cd /app/comments-service && npm start &
cd /app/moderation-service && npm start &
cd /app/query-service && npm start &
cd /app/event-bus && npm start &
cd /app/frontend && npm start
