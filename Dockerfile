# Build stage
FROM node:20-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files and built code
COPY package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/db ./db

# Install only production dependencies
RUN npm ci --only=production

# Expose the port the app runs on
EXPOSE 3001

# Start the application
CMD ["node", "dist/main"]
