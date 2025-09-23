FROM node:22-alpine

WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps --omit=dev

# Copy the rest of the code
COPY . .

EXPOSE 8000

CMD ["npm", "start"]


