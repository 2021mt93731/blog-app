FROM node:14

# Set the working directory to /app
WORKDIR /app

# Install MongoDB
RUN apt-get update && apt-get install -y gnupg2 && \
    wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add - && \
    echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/4.4 main" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list && \
    apt-get update && apt-get install -y mongodb-org

# Copy package.json and package-lock.json for each service and install dependencies
COPY blog-posts-service/package*.json /app/posts-service/
RUN cd /app/posts-service && npm install

COPY blog-comments-service/package*.json /app/comments-service/
RUN cd /app/comments-service && npm install

COPY blog-moderation-service/package*.json /app/moderation-service/
RUN cd /app/moderation-service && npm install

COPY blog-query-service/package*.json /app/query-service/
RUN cd /app/query-service && npm install

COPY event-bus/package*.json /app/event-bus/
RUN cd /app/event-bus && npm install

COPY blog-frontend/package*.json /app/frontend/
RUN cd /app/frontend && npm install

# Copy source code for services
COPY blog-posts-service /app/posts-service
COPY blog-comments-service /app/comments-service
COPY blog-moderation-service /app/moderation-service
COPY blog-query-service /app/query-service
COPY event-bus /app/event-bus
COPY blog-frontend /app/frontend

# Create data directory for MongoDB
RUN mkdir -p /data/db
RUN chown -R mongodb:mongodb /data/db

COPY ./mongod.conf /app
COPY ./startup.sh /app
RUN chmod +x /app/startup.sh

# Expose ports for services
EXPOSE 4000 4001 4002 4003 4004 4005 3000

# Start the startup script when the container starts
CMD ["/bin/bash", "/app/startup.sh"]
