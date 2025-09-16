# Example Dockerfile
FROM node:16

WORKDIR /app

# Copy all subfolders
COPY api-gateway ./api-gateway
COPY movie-app-backend-master ./movie-app-backend-master
COPY movie-app-frontend-master ./movie-app-frontend-master

# Install dependencies (or rely on Jenkins installed node_modules)
WORKDIR /app/movie-app-backend-master
RUN npm install

# Build / start your app as needed
CMD ["node", "index.js"]


# # ---------- Build Stage ----------
# FROM node:alpine AS build

# # Set working directory
# WORKDIR /app

# # Copy dependency files
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy rest of the code
# COPY . .

# # Build optimized production build
# RUN npm run build


# # ---------- Production Stage ----------
# FROM nginx:alpine

# # Copy build output to nginx html directory
# COPY --from=build /app/build /usr/share/nginx/html

# # Expose port 80
# EXPOSE 80

# # Start nginx
# CMD ["nginx", "-g", "daemon off;"]
# # ---------- End of Dockerfile ----------
