FROM node:22-alpine

WORKDIR /app

# Copy everything
COPY . .

# Install dependencies
RUN npm install

EXPOSE 5000

# Start the app
CMD ["npm", "start"]


