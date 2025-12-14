FROM node:24.11.0

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Run the application
CMD ["node", "dist/main.js"]
