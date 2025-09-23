FROM node:22-alpine

WORKDIR /app

# Copy package.json and package-lock.json first for caching
COPY package*.json ./

# Install dependencies with legacy peer deps
RUN npm install --legacy-peer-deps --no-audit --no-fund

# Copy rest of the source code
COPY . .

# Use environment variables from Docker/compose
ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000

# Start React app and bind to 0.0.0.0 for EC2 public access
CMD ["npm", "start", "--", "--host", "0.0.0.0"]
