# Use Node.js base image
FROM node:22

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Expose the default React dev server port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
