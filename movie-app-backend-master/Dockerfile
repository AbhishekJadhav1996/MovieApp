FROM node:22-alpine

WORKDIR /app

# Install only dependencies first (better caching)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy rest of the code
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
