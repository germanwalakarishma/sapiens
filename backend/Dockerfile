# Use Node.js base image
FROM node:22

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Expose the default server port
EXPOSE 5000

# Start the app
CMD ["npm", "start"]
