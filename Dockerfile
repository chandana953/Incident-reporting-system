# ─── Backend Dockerfile ────────────────────────────────────────
# Stage 1: Build / Production
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (layer caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Don't copy the client folder
RUN rm -rf client

# Expose the backend port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/ || exit 1

# Start server
CMD ["node", "server.js"]
