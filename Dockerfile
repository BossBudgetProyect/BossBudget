FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files from Front-end and install dependencies
COPY Front-end/package*.json ./
RUN npm ci --omit=dev

# Copy application source
COPY Front-end/ ./

# Use production mode by default and expose port
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Run the app
CMD ["node", "server.js"]
