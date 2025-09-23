FROM node:22-alpine

WORKDIR /app

# Install curl for Docker healthchecks
RUN apk add --no-cache curl

# Copy package files first for caching
COPY package*.json ./

# Install dependencies safely
RUN npm install --legacy-peer-deps --omit=dev

# Copy the rest of the code
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
